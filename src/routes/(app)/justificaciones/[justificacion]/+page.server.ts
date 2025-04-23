import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { justificacionesRepository } from '$lib/database/repositories/justificaciones.repository';
import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { unlink } from "fs/promises"
import path from 'path';

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
    delete: async ({request, locals}) => {
        let { log, response } = locals;
        let id_justificacion = (await request.formData()).get('id_justificacion') as string

        let justificacion = await async(justificacionesRepository.getById(id_justificacion), log)

        if (!justificacion) {
            return response.error('No se encontro la justificacion')
        }

        await async(
            db.transaction().execute(async (trx) => {
                if (new Date(justificacion.fecha_finalizacion) > new Date()) {
                    await empleadosRepository.update({ estado: 'Por Asignar' }, justificacion.empleado, trx)
                }

                let comprobantes = await trx
                    .selectFrom('comprobantes')
                    .selectAll()
                    .where('comprobantes.id_justificacion', '=', justificacion.id)
                    .execute()

                for (let c of comprobantes) {
                    let p = path.join(process.cwd(), `static`, c.path)
                    await unlink(p)
                }

                await trx.deleteFrom('comprobantes').where("comprobantes.id_justificacion", '=', id_justificacion).execute()
                await trx.deleteFrom('justificaciones').where('id', "=", id_justificacion).execute()
            })
        , log)

        redirect(303, '/empleados')
    }
} satisfies Actions