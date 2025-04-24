import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { departamentosRepository, empleadosRepository } from '$lib/database/repositories/empleados.repository';
import { generateUUID } from '$lib/utils/generateUUID';
import type { Departamento, Empleado } from '$lib/database/types';

export const load = (async ({ url, locals }) => {
    let { log, response } = locals
    let departamentos;
    
    departamentos = await async(
        db
        .selectFrom('departamentos')
        .leftJoin('empleados', "empleados.departamento", 'departamentos.id_departamento')
        .select((eb) => [
            'departamentos.nombre_departamento',
            'departamentos.descripcion',
            'departamentos.icon', 'departamentos.id_departamento',
            eb.fn.count('empleados.cedula').as('empleados')
        ])
        .groupBy('departamentos.id_departamento')
        .execute()
    , log)

    let empleados = await async(
        db
        .selectFrom('empleados')
        .selectAll()
        .execute()
    ,log)

    departamentos = departamentos?.map(i => {
        return {
            ...i,
            listaEmpleados: empleados?.filter(e => e.departamento === i.id_departamento)
        }
    })

    return { departamentos };
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ locals, request }) => {
        let { log, response } = locals
        let data = await request.formData()
        let nombre_departamento = data.get("nombre_departamento") as string
        let descripcion = data.get('descripcion') as string
        let icon = data.get('departamento_icon') as string

        await async(
            departamentosRepository.create({
                nombre_departamento: nombre_departamento,
                id_departamento: generateUUID(),
                descripcion: descripcion,
                icon: icon
        }), log)
    },

    deleteFromDepartamento: async ({locals, request}) => {
        let { log, response } = locals
        let cedula = (await request.formData()).get('cedula') as string
        await async(empleadosRepository.update({ departamento: null }, cedula), log)
        return response.success('Empleado eliminado del departamento correctamente')
    }
} satisfies Actions