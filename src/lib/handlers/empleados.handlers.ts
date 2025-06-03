import { db } from "$lib/database";
import path from "path"
import { empleadosRepository, type EmpleadosRepositoryInterface } from "$lib/database/repositories/empleados.repository";
import type { EmpleadoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import { getAge } from "$lib/utils/getAge";
import { getFormData } from "$lib/utils/getFormData";
import { newValidationFailObject, validateObject } from "$lib/utils/validators";
import { fail, type RequestEvent } from "@sveltejs/kit";
import { print } from "./pdf";
import { createEmpleadoDocDef } from "./pdf/empleadosDocuments";
import { unlinkSync } from "fs";
import { createAsistenciaDocumentDefinition } from "./pdf/constanciasDocument";

export async function createEmpleadoHandler(
    { request, locals }: RequestEvent,
    mock?: any,
    er: EmpleadosRepositoryInterface = empleadosRepository
) {
    let { response, log } = locals
    let nEmpleado = {
        cedula: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        sexo: "" as "Masculino" | "Femenino",
        fecha_nacimiento: "",

        direccion: "",

        grado_instruccion: "",
        especializacion: "",
        cargo: "",

        area: "",
        fecha_ingreso: "",
        turno: ""
    } satisfies Omit<Omit<EmpleadoInsertable, "edad">, "tiempo_servicio"> 
    // FALTA EDAD Y TIEMPO DE SERVICIO

    await async(getFormData(nEmpleado, request, mock), log)

    let validationResult = validateObject(nEmpleado, InsertEmpleadoSchema.omit({ edad: true, tiempo_servicio: true }))

    if (!validationResult.success) {
        return newValidationFailObject(validationResult.error, log)
    }

    // // NO PUEDE EXISTIR EN LA BASE DE DATOS
    let empleadoFromDB = await async(empleadosRepository.getById(nEmpleado.cedula), log)
    if (empleadoFromDB) {
        return fail(401, response.error('El empleado ya existe.'))
    }

    await async(er.create({
        ...nEmpleado,
        edad: getAge(nEmpleado.fecha_nacimiento),
        tiempo_servicio: `${getAge(nEmpleado.fecha_ingreso)} Años`
    }), log)

    return response.success('Empleado creado correctamente.')
}

export async function printEmpleadoHandler({ request, locals }: RequestEvent) {
    let { log, response } = locals;
    let cedula = (await request.formData()).get('cedula') as string

    let empleado = await async(
        db
        .selectFrom('empleados')
        .selectAll()
        .select(eb => 
            eb.selectFrom('departamentos').select('departamentos.nombre_departamento')
            .whereRef('departamentos.id_departamento', '=', 'empleados.departamento').as('departamento')
        )
        .where('cedula', '=', cedula)
        .executeTakeFirst()
    , log)

    if (!empleado) {
        return response.error('No existe el empleado especificado.')
    }

    let info_personal = await async(db.selectFrom('info_personal').selectAll().where('id_empleado', '=', empleado.cedula).executeTakeFirst(), log)
    let info_contacto = await async(db.selectFrom('info_contacto').selectAll().where('id_empleado', '=', empleado.cedula).executeTakeFirst(), log)
    let info_laboral = await async(db.selectFrom('info_laboral').selectAll().where('id_empleado', '=', empleado.cedula).executeTakeFirst(), log)

    const timeId = generateTimeId()
    const temporalPath = path.join(process.cwd(), `/static/temporal/empleado_${timeId}.pdf`);

    print (
        // createEmpleadoDocDef(empleado, info_personal, info_contacto, info_laboral),
        createAsistenciaDocumentDefinition(),
        temporalPath
    )
    setTimeout(() => unlinkSync(temporalPath), 10000);

    return response.success('Empleados obtenidos correctamente.', { fileId: timeId })
}

function generateTimeId() {
    return new Date().toISOString()
        .replaceAll(' ', '')
        .replaceAll(':', '')
        .replaceAll('-', '')
        .replaceAll('.', '');
}

