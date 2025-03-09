import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals }) => {
    let { response, log } = locals

    let index = url.searchParams.get('index') as string;
    let filter = url.searchParams.get('filter') as string;
    let search = url.searchParams.get('search') as string;
    let estado = url.searchParams.get('estado') as string;
    let turno = url.searchParams.get('turno') as string;
    let departamento = url.searchParams.get('departamento') as string;

    let empleados = await async(
        db
        .selectFrom('empleados')
        .selectAll()
        .execute()
    , log)

    return { empleados };
}) satisfies PageServerLoad;