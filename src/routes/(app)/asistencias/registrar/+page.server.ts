import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import QRCode from 'qrcode'
import type { AsistenciaInsertable } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { asistenciasRepository } from '$lib/database/repositories/asistencias.repository';
import { db } from '$lib/database';
import { createAsistenciaID } from '$lib/utils/getId';

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

        let observacion = data.get('observacion') as string

        let asistencia = await async(asistenciasRepository.getById(entrada.empleado, entrada.fecha), log)
        if (asistencia){ 
            if (asistencia.hora_entrada) {
                return error(404, 'La asistencia ya tiene un registro de entrada.')
            }
            return error(404, 'La asistencia ya existe.')
        }

        await async(asistenciasRepository.create({
            ...entrada, 
            id_asistencia: createAsistenciaID(entrada.empleado, entrada.fecha)
        }) ,log)

        // if (observacion) {
        //     await async(
        //         db.insertInto("observaciones_asistencias")

        //         , log)
        // }
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


        let observacion = data.get('observacion') as string

        let asistencia = await async(asistenciasRepository.getById(salida.empleado, salida.fecha), log)

        if (!asistencia){ 
            return error(404, 'La asistencia a la que se intenta anexar una salida no existe.')
        }

        await async(
            db.updateTable('asistencias')
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
        ,log)

        // if (observacion) {
        //     await async(
        //         db.insertInto("observaciones_asistencias")

        //         , log)
        // }
        return response.success('Asistencia correctamente Insertada!.')

    }
} satisfies Actions