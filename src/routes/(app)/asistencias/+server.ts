import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    let { log, response } = locals;

    let data = await request.json()
    let cedula_empleado = data.data as string;

    let empleado = await async(
        db
        .selectFrom('empleados')
        .innerJoin('departamentos', 'departamentos.id_departamento', 'empleados.departamento')
        .selectAll()
        .where('empleados.cedula', "=", cedula_empleado)
        .executeTakeFirst()
    , log)

    if (!empleado) {
        return new Response(JSON.stringify(response.error('El empleado no se encuentra registrado')))
    }

    return new Response(JSON.stringify(response.success('Empleado obtenido correctamente', { empleado: empleado })));
};