import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { departamentosRepository } from '$lib/database/repositories/empleados.repository';
import { generateUUID } from '$lib/utils/generateUUID';

export const load = (async ({ url, locals }) => {
    let { log, response } = locals
    let departamentos = await async(
        db
        .selectFrom('departamentos')
        .leftJoin('empleados', "empleados.departamento", 'departamentos.id_departamento')
        .select((eb) => [
            'departamentos.nombre_departamento',
            eb.fn.count('empleados.cedula').as('empleados')
        ])
        .groupBy('departamentos.id_departamento')
        .execute()
    , log)

    console.log(departamentos)

    return { departamentos };
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ locals, request }) => {
        let { log, response } = locals
        let nombre_departamento = (await request.formData()).get("nombre_departamento") as string

        await async(
            departamentosRepository.create({
                nombre_departamento: nombre_departamento,
                id_departamento: generateUUID()
        }), log)
    }
} satisfies Actions