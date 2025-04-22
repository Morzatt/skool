import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error, type Actions } from '@sveltejs/kit';
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
        .innerJoin('usuarios', 'usuarios.usuario', 'observaciones_asistencias.encargado_observacion')
        .select([
            'usuarios.nombre as nombre_usuario', 'usuarios.apellido as apellido_usuario', 'usuarios.role as role_usuario',

            'observaciones_asistencias.created_at', 'observaciones_asistencias.encargado_observacion', 'observaciones_asistencias.id_asistencia',
            'observaciones_asistencias.observacion', 'observaciones_asistencias.tipo_observacion'
        ])
        .where('observaciones_asistencias.id_asistencia', '=', asistencia.id_asistencia)
        .execute()       
    , log)

    return { asistencia, observaciones, justificacion, empleado, encargado };
}) satisfies PageServerLoad;

export const actions = {
    deleteObservation: async ({ locals, request }) => {
        let { log, response } = locals;
        let timestamp = (await request.formData()).get('timestamp') as string

        await async(
            db
            .deleteFrom('observaciones_asistencias')
            .where('created_at', '=', new Date(timestamp))
            .execute()
        , log)

        return response.success('Observacion eliminada correctamente.')
    },

    createObservation: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let observacion = {
            id_asistencia: data.get('id_asistencia') as string,
            observacion: data.get('observacion') as string,
            encargado: data.get('encargado') as string,
        }

        await async(
            db
            .insertInto('observaciones_asistencias')
            .values({
                id_asistencia: observacion.id_asistencia,
                encargado_observacion: observacion.encargado,
                tipo_observacion: 'General',
                observacion: observacion.observacion,
            })
            .execute()
        , log)

        return response.success('Observacion eliminada correctamente.')
    },
} satisfies Actions