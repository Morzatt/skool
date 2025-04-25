import { db } from "$lib/database";
import { comprobantesRepository, justificacionesRepository } from "$lib/database/repositories/justificaciones.repository";
import type { JustificacionInsertable } from "$lib/database/types";
import async, { handleError } from "$lib/utils/asyncHandler";
import { writeFile } from 'fs';
import { fail, type RequestEvent } from "@sveltejs/kit";
import { genSaltSync } from "bcrypt";
import { randomUUID } from "crypto";
import { empleadosRepository } from "$lib/database/repositories/empleados.repository";
import { 
    validateObject, 
    newValidationFailObject,
    justificacionSchema 
} from '$lib/utils/validators';

export async function createJustificacionHandler(
    { request, locals }: RequestEvent,
) {
    let { log, response } = locals

    let data = await request.formData()
    let comprobantes = data.getAll('comprobante') as File[]

    // TODO: MANEJAR LA DUPLICACION DE JUSTIFICACIONES
    let justificacion = {
        empleado: data.get("empleado") as string,
        tipo: data.get("tipo") as string,
        detalles: data.get("detalles") as string,
        fecha_inicio: data.get("fecha_inicio") as string,
        fecha_finalizacion: data.get("fecha_finalizacion") as string,
        razon: data.get('razon') as string,
        created_by: data.get('created_by') as string
    } satisfies Omit<JustificacionInsertable, "id">

    // Validate the justificacion object
    const validationResult = validateObject(justificacion, justificacionSchema);
    
    if (!validationResult.success) {
        return newValidationFailObject(validationResult.error, log);
    }

    // Additional business logic validation
    const fechaInicio = new Date(justificacion.fecha_inicio);
    const fechaFin = new Date(justificacion.fecha_finalizacion);
    
    if (fechaInicio > fechaFin) {
        return response.error('La fecha de inicio debe ser anterior a la fecha de finalización.');
    }

    const empleado = await async(empleadosRepository.getById(justificacion.empleado), log);
    
    if (!empleado) {
        return response.error('El empleado no existe.');
    }

    if (empleado.estado === "Inhabilitado" || empleado.estado === "Retirado") {
        return response.error('El empleado se encuentra inhabilitado dentro del sistema')
    }

    for (let i of comprobantes) {
        if (i.size === 0) {
            return fail(401, response.error('No se pueden enviar comprobantes de justificativos vacios.'))
        }
    }

    if (comprobantes.length < 1) {
        return fail(401, response.error('No se puede crear una justificacion sin al menos (1) comprobante fisico correspondiente'))
    }

    let ids = []

    for (let i of comprobantes) {
        let arrayBuffer = await i.arrayBuffer()
        let data = Buffer.from(arrayBuffer)
        let salt = genSaltSync(6);
        let id = `${justificacion.empleado}-${i.name}`
        ids.push(`${id}.${i.name.slice(i.name.lastIndexOf('.') + 1)}`)
        
        writeFile(`static/comprobantes/${id}.${i.name.slice(i.name.lastIndexOf('.') + 1)}`, data, (error) => {
            if (error) {
                handleError(log, error, {})
            }
        });
    }

    let justificacionID = randomUUID()

    await async(db.transaction().execute(async (trx) => {
        await justificacionesRepository.create(trx, {
            ...justificacion,
            id: justificacionID,
        })

        for (let i of ids) {
            await comprobantesRepository.create(trx, {
                id_comprobante: randomUUID(),
                id_justificacion: justificacionID,
                path: `/comprobantes/${i}`
            })
        }

        if (new Date(justificacion.fecha_finalizacion) > new Date()) {
            if (justificacion.tipo === "Reposo") {
                await async(trx.updateTable('empleados').set({estado: 'Reposo'}).where('empleados.cedula', '=', justificacion.empleado).execute(), log)
            }

            if (justificacion.tipo === "Permiso") {
                await async(trx.updateTable('empleados').set({ estado: 'De Permiso' }).where('empleados.cedula', '=', justificacion.empleado).execute(), log)
            }
        }
    }), log) 

    return response.success('Justificacion Añadida correctamente')
}