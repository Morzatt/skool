import { db } from "$lib/database";
import { comprobantesRepository, justificacionesRepository, type JustificacionesRepositoryInterface } from "$lib/database/repositories/justificaciones.repository";
import type { ComprobanteInsertable, JustificacionInsertable } from "$lib/database/types";
import async, { handleError } from "$lib/utils/asyncHandler";
import { writeFile, writeFileSync } from 'fs';
import { fail, type RequestEvent } from "@sveltejs/kit";
import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";

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

    if (justificacion.fecha_inicio > justificacion.fecha_finalizacion) {
        return fail(401, response.error('Malformación de Datos: la fecha de inicio es mayor que la de finalizacion'))       
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
        let id = `${justificacion.empleado}-${btoa(i.name).slice(0, 8)}`
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
    }), log) 

    return response.success('Justificacion Añadida correctamente')
}