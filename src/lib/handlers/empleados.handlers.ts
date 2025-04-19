import { empleadosRepository, type EmpleadosRepositoryInterface } from "$lib/database/repositories/profesores.repository";
import type { EmpleadoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import { getAge } from "$lib/utils/getAge";
import { getFormData } from "$lib/utils/getFormData";
import { InsertEmpleadoSchema, newValidationFailObject, validateObject } from "$lib/utils/validators";
import { fail, type RequestEvent } from "@sveltejs/kit";

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