import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import QRCode from 'qrcode'
import type { AsistenciaInsertable } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { asistenciasRepository } from '$lib/database/repositories/asistencias.repository';
import { db } from '$lib/database';
import { createAsistenciaID } from '$lib/utils/getId';
import { fail } from '@sveltejs/kit';
import { justificacionesRepository } from '$lib/database/repositories/justificaciones.repository';
import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { checkVigencia } from '$lib/utils/vigencia';

export const load = (async ({locals}) => {
    let qr = await QRCode.toDataURL('8933618', {
        errorCorrectionLevel: "H"
    })
    
    return { qr, usuario: locals.usuario };
}) satisfies PageServerLoad;

export const actions = {
    entrada: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let entrada = {
            empleado: data.get("empleado") as string,
            encargado: data.get("encargado") as string,
            hora_entrada: data.get("hora_entrada") as string,
            fecha: data.get("fecha") as string,
        } satisfies Omit<AsistenciaInsertable, "id_asistencia">

        let observacion = data.get('observacion') as string | undefined | null

        let asistencia = await async(asistenciasRepository.getById(entrada.empleado, entrada.fecha), log)
        if (asistencia){ 
            if (asistencia.hora_entrada) {
                return fail(404, response.error('La asistencia ya tiene un registro de entrada.'))
            }
            return fail(404, response.error('La asistencia ya existe.'))
        }

        let justificacionesEmpleado = await async(
            db
            .selectFrom('justificaciones')
            .selectAll()
            .where('justificaciones.empleado', '=', entrada.empleado)
            .execute()
        ,log)

        let empleado = await async(empleadosRepository.getById(entrada.empleado), log)

        if (!empleado){ 
            return response.error('No se pudo obtener empleado')
        }

        if (empleado.estado !== 'Activo') {
            return response.error('El empleado debe de poseer el estado "Activo" para registrar asistencias.')
        }

        if (justificacionesEmpleado) {
            for (let j of justificacionesEmpleado) {
                let vigencia = checkVigencia(j.fecha_inicio, j.fecha_inicio)
                if (vigencia === "Vigente") {
                    return response.error('Existe una justificacion bloqueando la asistencia')
                }
            }
        }

        await async(
            db.transaction().execute(async (trx) => {
                let asistenciaID = createAsistenciaID(entrada.empleado, entrada.fecha)

                await asistenciasRepository.create({
                    ...entrada,
                    id_asistencia: asistenciaID
                }, trx)

                if (observacion && observacion.length > 0) {
                    await trx
                    .insertInto('observaciones_asistencias')
                    .values({
                        id_asistencia: asistenciaID,
                        encargado_observacion: entrada.encargado,
                        tipo_observacion: "Entrada",
                        observacion: observacion,
                    })
                    .execute()
                }
            })
        , log)

        return response.success('Asistencia correctamente Insertada!.')
    },

    salida: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let salida = {
            empleado: data.get("empleado") as string,
            encargado: data.get("encargado") as string,
            hora_entrada: "",
            hora_salida: data.get("hora_salida") as string,
            fecha: data.get("fecha") as string,
        } satisfies Omit<AsistenciaInsertable, "id_asistencia">


        let observacion = data.get('observacion') as string | undefined | null
        let asistencia = await async(asistenciasRepository.getById(salida.empleado, salida.fecha), log)

        if (!asistencia){ 
            return fail(404, response.error('La asistencia a la que se intenta anexar una salida no existe.'))
        }

        await async(
            db.transaction().execute(async (trx) => {
                await trx.updateTable('asistencias')
                .set({
                    hora_salida: salida.hora_salida,
                })
                .where((eb) =>
                    eb.and([
                        eb('asistencias.empleado', "=", salida.empleado),
                        eb('asistencias.fecha', "=", salida.fecha),
                    ])
                )
                .execute()

                if (observacion && observacion.length > 0) {
                    await trx
                    .insertInto('observaciones_asistencias')
                    .values({
                        id_asistencia: asistencia.id_asistencia,
                        encargado_observacion: salida.encargado,
                        tipo_observacion: "Salida",
                        observacion: observacion,
                    })
                    .execute()
                }
            })
        ,log)

        return response.success('Asistencia correctamente Insertada!.')
    }
} satisfies Actions