import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import QRCode from "qrcode"
import { departamentosRepository, empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { createJustificacionHandler } from '$lib/handlers/Justificaciones.handler';
import type { InfoContactoInsertable } from '$lib/database/types';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula_empleado = getId(url.pathname)

    let empleado = await async(
        db
        .selectFrom('empleados')
        .leftJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
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
        .leftJoin('usuarios', 'usuarios.usuario', 'justificaciones.created_by')
        .select((eb) => [
            'justificaciones.detalles', 'justificaciones.empleado',
            'justificaciones.fecha_inicio', 'justificaciones.fecha_finalizacion', 'justificaciones.id',
            'justificaciones.tipo', 'justificaciones.created_by', 'justificaciones.razon', 'justificaciones.created_at',
            'usuarios.nombre as nombre_encargado', 'usuarios.apellido as apellido_encargado',
                eb.selectFrom('comprobantes')
                .whereRef('comprobantes.id_justificacion', '=', 'justificaciones.id')
                .select(['comprobantes.path'])
                .limit(1)
                .as('path')
        ])
        .where('empleado', "=", cedula_empleado)
        .execute()
    , log)

    let personal = await async(
        db.selectFrom("info_personal")
        .selectAll()
        .where('id_empleado', "=", cedula_empleado)
        .executeTakeFirst()
    , log)

    let contacto = await async(
        db.selectFrom("info_contacto")
        .selectAll()
        .where('id_empleado', "=", cedula_empleado)
        .executeTakeFirst()
    , log)

    let laboral = await async(
        db.selectFrom("info_laboral")
        .selectAll()
        .where('id_empleado', "=", cedula_empleado)
        .executeTakeFirst()
    , log)

    let departamentos = await async(db.selectFrom('departamentos').selectAll().execute(), log)

    return { empleado, qr, justificaciones, personal, contacto, laboral, departamentos}
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

    createJustificacion: createJustificacionHandler,

    personal: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let personal = await async(db.selectFrom('info_personal').selectAll().where('info_personal.id_empleado', "=", data.get('id_empleado') as string).executeTakeFirst(), log)

        if (!personal) {
            await async(
                db
                .insertInto('info_personal')
                .values({
                    id_empleado: data.get("id_empleado") as string,
                    estado_civil: data.get('estado_civil') as string,
                    nivel_academico: data.get('nivel_academico') as string,
                })
                .execute()
            , log)
        } else {
            await async(
                db.updateTable('info_personal')
                .set({
                    estado_civil: data.get('estado_civil') as string,
                    nivel_academico: data.get('nivel_academico') as string,
                })
                .where("id_empleado", '=', data.get("id_empleado") as string)
                .execute()
            , log)
        }
    },

    contacto: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let contacto = await async(db.selectFrom('info_contacto').selectAll().where('info_contacto.id_empleado', "=", data.get('id_empleado') as string).executeTakeFirst(), log)

        if (!contacto) {
            await async(
                db
                .insertInto('info_contacto')
                .values({
                    id_empleado: data.get("id_empleado") as string,
                    direccion_habitacion: data.get('direccion_habitacion') as string,
                    telefono_habitacion: data.get('telefono_habitacion') as string,
                    telefono_personal: data.get('telefono_personal') as string,
                    correo_electronico: data.get('correo_electronico') as string,
                })
                .execute()
            , log)
        } else {
            await async(
                db.updateTable('info_contacto')
                .set({
                    direccion_habitacion: data.get('direccion_habitacion') as string,
                    telefono_habitacion: data.get('telefono_habitacion') as string,
                    telefono_personal: data.get('telefono_personal') as string,
                    correo_electronico: data.get('correo_electronico') as string,
                })
                .where("id_empleado", '=', data.get("id_empleado") as string)
                .execute()
            , log)
        }
    },

    laboral: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let cedula_empleado = data.get('id_empleado') as string

        let laboral = await async(db.selectFrom('info_laboral').selectAll().where('info_laboral.id_empleado', "=", data.get('id_empleado') as string).executeTakeFirst(), log)
        let empleado = await async(
            db
            .selectFrom('empleados')
            .leftJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
            .select(['empleados.cedula', 'empleados.departamento', 'empleados.cargo'])
            .executeTakeFirst()
        , log)

        if (!empleado) {
            return response.error('El empleado no existe')
        }

        if (data.get('departamento') !== empleado.departamento) { 
            await async(
                db.updateTable('empleados')
                .set({departamento: data.get('departamento') as string})
                .where('empleados.cedula', '=', cedula_empleado)
                .execute()
            , log)
        }

        if (data.get('cargo') !== empleado.cargo) {
            await async(
                db.updateTable('empleados')
                .set({cargo: data.get('cargo') as string})
                .where('empleados.cedula', '=', cedula_empleado)
                .execute()
            , log)
        }
        
        let hora_entrada = data.get('hora_entrada') as string
        let hora_salida = data.get('hora_salida') as string

        if (!hora_entrada || !hora_salida) {
            return response.error('No se han especificado horas de entrada/salida')
        }

        if (parseInt(hora_entrada.replaceAll(":", "")) > parseInt(hora_salida.replaceAll(":", ""))) {
            return response.error('La hora de entrada es superior a la hora de salida.')
        }

        if (!laboral) {
            await async(
                db
                .insertInto('info_laboral')
                .values({
                    id_empleado: data.get("id_empleado") as string,
                    hora_entrada: hora_entrada,
                    hora_salida: hora_salida
                })
                .execute()
            , log)
            await async(
                db
                .updateTable('empleados')
                .set({
                    turno: data.get('turno') as "Mañana" | "Tarde"
                })
                .where('empleados.cedula', '=', data.get("id_empleado") as string)
                .execute()
            , log)
        } else {
            await async(
                db.updateTable('info_laboral')
                .set({
                    hora_entrada: data.get('hora_entrada') as string,
                    hora_salida: data.get('hora_salida') as string,
                })
                .where("id_empleado", '=', data.get("id_empleado") as string)
                .execute()
            , log)
            await async(
                db
                .updateTable('empleados')
                .set({
                    turno: data.get('turno') as "Mañana" | "Tarde"
                })
                .where('empleados.cedula', '=', data.get("id_empleado") as string)
                .execute()
            , log)
        }
    },

    medic: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData()

    },
} satisfies Actions
