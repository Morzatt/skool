import { empleadosRepository } from '$lib/database/repositories/empleados.repository';
import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula_empleado = getId(url.pathname)

    let empleado = await async(empleadosRepository.getById(cedula_empleado), log)

    return { empleado }
});

