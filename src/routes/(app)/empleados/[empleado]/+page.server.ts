import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import QRCode from "qrcode"
import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { createJustificacionHandler } from '$lib/handlers/Justificaciones.handler';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula_empleado = getId(url.pathname)

    let empleado = await async(
        db
        .selectFrom('empleados')
        .innerJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
        .selectAll()
        .where('cedula', "=", cedula_empleado)
        .executeTakeFirst()
    ,log)

    if (!empleado) {
        error(404, 'El empleado no existe')
    }

    let qr = await QRCode.toDataURL(empleado.cedula, {
        errorCorrectionLevel: "H"
    })

    let justificaciones = await async(
        db
        .selectFrom('justificaciones')
        .select((eb) => [
            'justificaciones.detalles', 'justificaciones.empleado',
            'justificaciones.fecha_inicio', 'justificaciones.fecha_finalizacion', 'justificaciones.id',
            'justificaciones.tipo',
                eb.selectFrom('comprobantes')
                .whereRef('comprobantes.id_justificacion', '=', 'justificaciones.id')
                .select(['comprobantes.path'])
                .limit(1)
                .as('path')
        ])
        .where('empleado', "=", cedula_empleado)
        .execute()
    , log)

    console.log(justificaciones)

    return { empleado, qr, justificaciones }
});

export const actions = {
    deleteEmpleado: async ({ request, locals }) => {
        let { log } = locals
        let cedula = (await request.formData()).get("cedula") as string

        await async(empleadosRepository.delete(cedula), log)

        redirect(303, "/empleados")
    },

    retirar: async ({request, locals}) => {
        let { log, response } = locals
        let cedula = (await request.formData()).get("cedula") as string

        await async(empleadosRepository.update({
            estado: "Inhabilitado",
        }, cedula), log)

        return response.success("Usuario Inhabilitado Correctamente")
    },

    createJustificacion: createJustificacionHandler
} satisfies Actions
