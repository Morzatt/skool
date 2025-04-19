import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals }) => {
    let { log } = locals

    let [id_empleado, fecha_asistencia] = getId(url.pathname).split('_')

    let asistencia = await async (
        db.selectFrom('asistencias')
        .where((eb) => 
            eb.and([
                eb('asistencias.empleado', "=", id_empleado),
                eb('asistencias.fecha', "=", fecha_asistencia)
            ])
        )
        .selectAll()
        .executeTakeFirst()
    , log)

    if (!asistencia) {
        return error(404, 'La asistencia no existe')
    }

    let encargado = await async (
        db
        .selectFrom('usuarios')
        .where('usuarios.usuario', "=", asistencia.encargado)
        .selectAll()
        .executeTakeFirst()
    , log)

    let empleado = await async(
        db.selectFrom('empleados')
        .innerJoin('departamentos', 'departamentos.id_departamento', 'empleados.departamento')
        .where('empleados.cedula', "=", asistencia.empleado)
        .selectAll()
        .executeTakeFirst()
    , log)

    if (!empleado) {
        return error(404, 'El empleado  no existe')
    }

    let justificacion = await async (
        db.selectFrom('justificaciones')
        .where((eb) => 
            eb.and([
                eb('justificaciones.fecha_inicio', '<=', asistencia?.fecha),
                eb('justificaciones.fecha_finalizacion', '>=', asistencia?.fecha)
            ])
        )
        .selectAll()
        .execute()
    , log)

    let observaciones = await async (
        db.selectFrom("observaciones_asistencias")
        .selectAll()
        .where('observaciones_asistencias.id_asistencia', '=', asistencia.id_asistencia)
        .execute()       
    , log)

    return { asistencia, observaciones, justificacion, empleado, encargado };
}) satisfies PageServerLoad;