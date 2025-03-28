import { getId } from '$lib/utils/getId';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals }) => {
    let { log } = locals

    let [id_empleado, fecha_asistencia] = getId(url.pathname).split('_')

    console.log(new Date(fecha_asistencia).toLocaleDateString())

    return {};
}) satisfies PageServerLoad;