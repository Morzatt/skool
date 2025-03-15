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
        .leftJoin('comprobantes', 'comprobantes.id_justificacion', 'justificaciones.id')
        .selectAll()
        .where("justificaciones.id", "=", id_justificacion)
        .executeTakeFirst()
    , log)

    if (!justificacion) {
        error(404, 'La justificacion no existe')
    }

    return { justificacion }
});

