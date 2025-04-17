import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import QRCode from 'qrcode'
import type { AsistenciaInsertable } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { asistenciasRepository } from '$lib/database/repositories/asistencias.repository';
import { db } from '$lib/database';

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
        } satisfies AsistenciaInsertable

        let observacion = data.get('observacion') as string

        await async(asistenciasRepository.create(entrada) ,log)

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
        } satisfies AsistenciaInsertable


        let observacion = data.get('observacion') as string

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