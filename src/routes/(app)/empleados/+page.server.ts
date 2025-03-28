import { db } from '$lib/database';
import type { Empleado, EstadosEmpleado } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals }) => {
    let { response, log } = locals

    let index = parseInt(url.searchParams.get('index') as string)
    let filter = url.searchParams.get('filter') as string;
    let search = url.searchParams.get('search') as string;

    let estado = capitalizeFirstLetter(url.searchParams.get('estado') as string) as EstadosEmpleado;
    let turno = capitalizeFirstLetter(url.searchParams.get('turno') as string) as 'Mañana' | 'Tarde';
    let departamento = url.searchParams.get('departamento') as string;


    let cedula: 'asc' | 'desc' = url.searchParams.get('cOrder') as "asc" | 'desc';
    let nombre: 'asc' | 'desc' = url.searchParams.get('nOrder') as "asc" | 'desc';
    let apellido: 'asc' | 'desc' = url.searchParams.get('aOrder') as "asc" | 'desc';
    let fecha: 'asc' | 'desc' = url.searchParams.get('fOrder') as "asc" | 'desc';

    let query = db
        .selectFrom('empleados')
        .limit(10)
        .offset(index ? index : 0)
        .orderBy("empleados.created_at desc")
    
    switch (true) {
        case cedula !== "asc":
            query = query.orderBy(`empleados.cedula ${cedula ? cedula : "desc"}`);
        case nombre !== "asc":
            query = query.orderBy(`empleados.primer_nombre ${nombre ? nombre : "asc"}`)
        case apellido !== "asc":
            query = query.orderBy(`empleados.primer_apellido ${apellido ? apellido : "desc"}`)
        case fecha !== "asc":
            query = query.orderBy(`empleados.fecha_nacimiento ${fecha ? fecha : "desc"}`)
    }

    let empleados: Empleado[] | undefined;
    let records: number;

    if (estado) {
        query = query.where(`empleados.estado`, '=', estado)
    }

    if (turno) {
        query = query.where('empleados.turno', "=", turno)
    }

    if (departamento) {
        query = query.where('empleados.departamento', "=", departamento)
    }

    if (filter && search) {
        query = query.where(`empleados.${filter}`, 'like', `%${search}%`)
    }

    empleados = await async(query.selectAll().execute(), log)
    records = parseInt(
        (
            (
                await query
                    .select((eb) => eb.fn.count('cedula').as('records'))
                    .executeTakeFirst()
            )?.records
        )?.toString()!
    )
    let total = parseInt(((await async(db.selectFrom('empleados').select((eb) => eb.fn.count('cedula').as('records')).executeTakeFirst(), log))?.records)?.toString()!)
    let departamentos = await async(db.selectFrom('departamentos').selectAll().execute(), log)

    return { empleados, departamentos, records, total };
}) satisfies PageServerLoad;