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
    },

    deleteDepartamento: async ({locals, request}) => {
        let { log, response } = locals
        let id_departamento = (await request.formData()).get('id_departamento') as string
        await async(departamentosRepository.delete(id_departamento), log)

        return response.success('Departamento eliminado correctamente')
    },

    addEmpleado: async ({locals, request}) => {
        let { log, response } = locals
        let data = await request.formData()
        let id_departamento = data.get('id_departamento') as string
        let cedula_empleado = data.get('cedula_empleado') as string

        await async(empleadosRepository.update({ departamento: id_departamento }, cedula_empleado), log)
        return response.success('Departamento eliminado correctamente')
    },

    edit: async ({locals, request}) => {
        let { log, response } = locals
        let data = await request.formData()
        let id = data.get('id_departamento') as string
        let nombre = data.get('nombre_departamento') as string
        let descripcion = data.get('descripcion') as string

        if (nombre) {
            await async(
                db
                .updateTable('departamentos')
                .set({nombre_departamento: nombre})
                .where('departamentos.id_departamento', "=", id)
                .execute()
            ,log)
            return response.success('Nombre del departamento cambiado correctamente')
        }

        if (descripcion) {
            await async(
                db
                .updateTable('departamentos')
                .set({ descripcion: descripcion })
                .where('departamentos.id_departamento', "=", id)
                .execute()
            ,log)
            return response.success('Descripcion del departamento cambiada correctamente')
        }
    },
} satisfies Actions