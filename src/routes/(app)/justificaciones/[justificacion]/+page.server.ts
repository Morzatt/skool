import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { comprobantesRepository, justificacionesRepository } from '$lib/database/repositories/justificaciones.repository';
import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { access, unlink, constants } from "fs/promises"
import path from 'path';
import { fail } from '@sveltejs/kit';
import { writeFile } from 'fs';
import { handleError } from '$lib/utils/asyncHandler';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let id_justificacion = getId(url.pathname)

    let justificacion = await async(
        db
            .selectFrom('justificaciones')
            .innerJoin('empleados', 'empleados.cedula', 'justificaciones.empleado')
            .selectAll()
            .where("justificaciones.id", "=", id_justificacion)
            .executeTakeFirst()
        , log)

    if (!justificacion) {
        error(404, 'La justificacion no existe')
    }

    let encargado = await async(
        db.selectFrom('usuarios')
            .selectAll()
            .where('usuarios.usuario', '=', justificacion.created_by)
            .executeTakeFirst()
        , log)

    let comprobantes = await async(
        db
            .selectFrom('comprobantes')
            .selectAll()
            .where("comprobantes.id_justificacion", "=", id_justificacion)
            .execute()
        , log)

    return { justificacion, comprobantes, encargado }
});

export const actions = {
    delete: async ({ request, locals }) => {
        let { log, response } = locals;
        let id_justificacion = (await request.formData()).get('id_justificacion') as string

        let justificacion = await async(justificacionesRepository.getById(id_justificacion), log)

        if (!justificacion) {
            return response.error('No se encontro la justificacion')
        }

        let comprobantes = await db 
            .selectFrom('comprobantes')
            .selectAll()
            .where('comprobantes.id_justificacion', '=', justificacion.id)
            .execute()

        if (comprobantes) {
            for (let c of comprobantes) {
                let p = path.join(process.cwd(), `static`, c.path)
                try {
                    await access(p, constants.F_OK)
                    await unlink(p)
                } catch (error) {
                }
            }
        }

        await async(
            db.transaction().execute(async (trx) => {
                if (new Date(justificacion.fecha_finalizacion) > new Date()) {
                    await empleadosRepository.update({ estado: 'Por Asignar' }, justificacion.empleado, trx)
                }

                await trx.deleteFrom('comprobantes').where("comprobantes.id_justificacion", '=', id_justificacion).execute()
                await trx.deleteFrom('justificaciones').where('id', "=", id_justificacion).execute()
            })
        , log)

        redirect(303, '/justificaciones')
    },

    addComprobantes: async ({ request, locals }) => {
        let { log, response } = locals

        let data = await request.formData()
        let id_justificacion = data.get('id_justificacion') as string

        let justificacion = await async(justificacionesRepository.getById(id_justificacion), log)
        if (!justificacion) {
            return
        }

        let comprobantes = data.getAll('comprobante') as File[]
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
            let id = `${justificacion?.empleado}-${i.name}`
            ids.push(`${id}.${i.name.slice(i.name.lastIndexOf('.') + 1)}`)

            writeFile(`static/comprobantes/${id}.${i.name.slice(i.name.lastIndexOf('.') + 1)}`, data, (error) => {
                if (error) {
                    handleError(log, error, {})
                }
            });
        }

        await async(db.transaction().execute(async (trx) => {
            for (let i of ids) {
                await comprobantesRepository.create(trx, {
                    id_comprobante: randomUUID(),
                    id_justificacion: justificacion.id,
                    path: `/comprobantes/${i}`
                })
            }
        }), log)

        return response.success('Justificacion Añadida correctamente')
    }
} satisfies Actions