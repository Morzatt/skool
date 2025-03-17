import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

    let comprobantes = await async(
        db
        .selectFrom('comprobantes')
        .selectAll()
        .where("comprobantes.id_justificacion", "=", id_justificacion)
        .execute()
    , log)


    if (!justificacion) {
        error(404, 'La justificacion no existe')
    }

    return { justificacion, comprobantes }
});

