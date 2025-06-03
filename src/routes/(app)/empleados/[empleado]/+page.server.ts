import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import QRCode from "qrcode"
import { createJustificacionHandler } from '$lib/handlers/Justificaciones.handler';

import {
    validateObject,
    newValidationFailObject,
    contactoInfoSchema,
    laboralInfoSchema,
    justificacionSchema
} from '$lib/utils/validators';
import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { downloadIDHandler } from '$lib/handlers/print.handlers';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response, usuario } = locals;

    if (!usuario.role.includes('admin')) {
        redirect(308, '/empleados')
    }

    let cedula_empleado = getId(url.pathname)

    let empleado = await async(
        db
        .selectFrom('empleados')
        .leftJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
        .selectAll()
        .where('cedula', "=", cedula_empleado)
        .executeTakeFirst()
        , log)

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

    const asistencias = await async(
        db.selectFrom('asistencias')
            .selectAll()
            .where('empleado', "=", cedula_empleado)
            .execute()
        , log)

    return { empleado, qr, justificaciones, personal, contacto, laboral, departamentos, asistencias }
});

export const actions = {
    activar: async ({ request, locals }) => {
        let { log, response } = locals
        let cedula = (await request.formData()).get("cedula") as string

        await async(empleadosRepository.update({ estado: 'Activo' }, cedula), log)
        return response.success('Empleado activado correctamente.')
    },

    deleteEmpleado: async ({ request, locals }) => {
        let { log } = locals
        let cedula = (await request.formData()).get("cedula") as string

        await async(empleadosRepository.delete(cedula), log)
        redirect(303, "/empleados")
    },

    retirar: async ({ request, locals }) => {
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
        let data = await request.formData();

        // Create object for validation
        const personalData = {
            id_empleado: data.get('id_empleado') as string,
            estado_civil: data.get('estado_civil') as string,
            nivel_academico: data.get('nivel_academico') as string,
        };

        // Proceed with database operations
        let personal = await async(db.selectFrom('info_personal').selectAll().where('info_personal.id_empleado', "=", personalData.id_empleado).executeTakeFirst(), log);

        if (!personal) {
            await async(
                db
                .insertInto('info_personal')
                    .values(personalData)
                .execute()
                , log);

            return response.success('Información personal registrada correctamente');
        } else {
            await async(
                db.updateTable('info_personal')
                .set({
                        estado_civil: personalData.estado_civil,
                        nivel_academico: personalData.nivel_academico,
                })
                    .where("id_empleado", '=', personalData.id_empleado)
                .execute()
                , log);

            return response.success('Información personal actualizada correctamente');
        }
    },

    contacto: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData();

        // Create object for validation
        const contactoData = {
            id_empleado: data.get('id_empleado') as string,
            direccion_habitacion: data.get('direccion_habitacion') as string,
            telefono_habitacion: data.get('telefono_habitacion') as string,
            telefono_personal: data.get('telefono_personal') as string,
            correo_electronico: data.get('correo_electronico') as string,
        };

        // Validate data
        // const validationResult = validateObject(contactoData, contactoInfoSchema.optional());

        // if (!validationResult.success) {
        //     return newValidationFailObject(validationResult.error, log);
        // }

        // Proceed with database operations
        let contacto = await async(db.selectFrom('info_contacto').selectAll().where('info_contacto.id_empleado', "=", contactoData.id_empleado).executeTakeFirst(), log);

        if (!contacto) {
            await async(
                db
                .insertInto('info_contacto')
                    .values(contactoData)
                .execute()
                , log);

            return response.success('Información de contacto registrada correctamente');
        } else {
            await async(
                db.updateTable('info_contacto')
                .set({
                        direccion_habitacion: contactoData.direccion_habitacion,
                        telefono_habitacion: contactoData.telefono_habitacion,
                        telefono_personal: contactoData.telefono_personal,
                        correo_electronico: contactoData.correo_electronico,
                    })
                    .where("id_empleado", '=', contactoData.id_empleado)
                .execute()
                , log);

            return response.success('Información de contacto actualizada correctamente');
        }
    },

    laboral: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData();

        // Create object for validation
        const laboralData = {
            id_empleado: data.get('id_empleado') as string,
            departamento: data.get('departamento') as string,
            cargo: data.get('cargo') as string,
            hora_entrada: data.get('hora_entrada') as string,
            hora_salida: data.get('hora_salida') as string,
            turno: data.get('turno') as "Mañana" | "Tarde",
        };

        if (laboralData.hora_entrada && laboralData.hora_salida) {
            if (!laboralData.hora_entrada || !laboralData.hora_salida) {
                return response.error('No se han especificado horas de entrada/salida');
            }

            if (parseInt(laboralData.hora_entrada.replaceAll(":", "")) > parseInt(laboralData.hora_salida.replaceAll(":", ""))) {
                return response.error('La hora de entrada es superior a la hora de salida.');
            }
        }

        let empleado = await async(
            db
            .selectFrom('empleados')
            .leftJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
                .select(['empleados.cedula', 'empleados.departamento', 'empleados.cargo', 'empleados.turno'])
                .where('empleados.cedula', '=', laboralData.id_empleado)
            .executeTakeFirst()
            , log);

        if (!empleado) {
            return response.error('El empleado no existe');
        }

        // Update department and position if needed
        if (laboralData.departamento !== empleado.departamento) {
            await async(
                db.updateTable('empleados')
                    .set({ departamento: laboralData.departamento })
                    .where('empleados.cedula', '=', laboralData.id_empleado)
                .execute()
                , log);
        }

        if (laboralData.cargo !== empleado.cargo) {
            await async(
                db.updateTable('empleados')
                    .set({ cargo: laboralData.cargo })
                    .where('empleados.cedula', '=', laboralData.id_empleado)
                .execute()
                , log);
        }

        // Update or insert labor info
        let laboral = await async(db.selectFrom('info_laboral').selectAll().where('info_laboral.id_empleado', "=", laboralData.id_empleado).executeTakeFirst(), log);

        if (!laboral) {
            await async(
                db
                .insertInto('info_laboral')
                .values({
                        id_empleado: laboralData.id_empleado,
                        hora_entrada: laboralData.hora_entrada,
                        hora_salida: laboralData.hora_salida
                })
                .execute()
                , log);
        } else {
            if (laboralData.hora_entrada && laboralData.hora_salida) {
            await async(
                db.updateTable('info_laboral')
                .set({
                            hora_entrada: laboralData.hora_entrada,
                            hora_salida: laboralData.hora_salida,
                })
                        .where("id_empleado", '=', laboralData.id_empleado)
                .execute()
                    , log);
            }
        }

        if (laboralData.turno !== empleado.turno) {
            await async(
                db
                .updateTable('empleados')
                .set({
                        turno: laboralData.turno
                })
                    .where('empleados.cedula', '=', laboralData.id_empleado)
                .execute()
                , log);
        }

        return response.success('Información laboral actualizada correctamente');
    },

    medic: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData()

    },

    downloadID: downloadIDHandler
} satisfies Actions
