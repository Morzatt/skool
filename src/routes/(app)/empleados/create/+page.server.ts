import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import async from '$lib/utils/asyncHandler';
import { db } from '$lib/database';
import type { EmpleadoInsertable, EstadosEmpleado } from '$lib/database/types';
import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { getAge } from '$lib/utils/getAge';

export const load = (async ({locals, url}) => {
    let { log } = locals
    let departamentos = await async(db.selectFrom('departamentos').selectAll().execute(), log)
    return { departamentos };
}) satisfies PageServerLoad;

export const actions = {
    create: async ({locals, request}) =>{
        let { log, response } = locals
        let data = await request.formData()

        let empleado = {
            cedula:            data.get('cedula') as string,
            primer_nombre:     data.get("primer_nombre") as string,
            segundo_nombre:    data.get("segundo_apellido") as string,
            primer_apellido:   data.get("primer_apellido") as string,
            segundo_apellido:  data.get("segundo_apellido") as string,
            sexo: data.get('sexo') as "Masculino" | "Femenino",
            nacionalidad:      data.get('nacionalidad') as "Extranjero" | "Venezolano",
            fecha_nacimiento:  data.get('fecha_nacimiento') as string,
            departamento:      data.get('departamento') as string,
            cargo:             data.get('cargo') as string,
            turno:             data.get('turno') as "Mañana" | "Tarde",
        } satisfies Omit<EmpleadoInsertable, "edad"> 

        await async(empleadosRepository.create({
            ...empleado,
            edad: getAge(empleado.fecha_nacimiento),
        }) ,log)
    }
} satisfies Actions 
