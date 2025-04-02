import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals }) => {
    let { log } = locals

    let [id_empleado, fecha_asistencia] = getId(url.pathname).split('_')

    let asistencia = await async (
        db.selectFrom('asistencias')
        .selectAll()
        .where((eb) => 
            eb.and([
                eb('asistencias.empleado', "=", id_empleado),
                eb('asistencias.fecha', "=", fecha_asistencia)
            ])
        )
        .executeTakeFirst()
    ,log)

    let observaciones = await async (
        db.selectFrom('asistencias')
        .selectAll()
        .where((eb) => 
            eb.and([
                eb('asistencias.empleado', "=", id_empleado),
                eb('asistencias.fecha', "=", fecha_asistencia)
            ])
        )
        .executeTakeFirst()       
    , log)

    return {};
}) satisfies PageServerLoad;