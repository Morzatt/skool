import { db } from '$lib/database';
import type { Empleado, EstadosEmpleado, Justificacion } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, url}) => {
    let {log} = locals;
    let index = parseInt(url.searchParams.get('index') as string)
    let filter = url.searchParams.get('filter') as string;
    let search = url.searchParams.get('search') as string;

    let query = db
        .selectFrom('justificaciones')
        .leftJoin('usuarios', 'usuarios.usuario', 'justificaciones.created_by')
        .leftJoin('empleados', 'empleados.cedula', 'justificaciones.empleado')
        .select((eb) => [
            'justificaciones.detalles', 'justificaciones.empleado',
            'justificaciones.fecha_inicio', 'justificaciones.fecha_finalizacion', 'justificaciones.id',
            'justificaciones.tipo', 'justificaciones.created_by', 'justificaciones.razon', 'justificaciones.created_at',
            'usuarios.nombre as nombre_encargado',
            'empleados.primer_nombre as nombre_empleado', 'empleados.primer_apellido as apellido_empleado',
             'usuarios.apellido as apellido_encargado',
                eb.selectFrom('comprobantes')
                .whereRef('comprobantes.id_justificacion', '=', 'justificaciones.id')
                .select(['comprobantes.path'])
                .limit(1)
                .as('path')
        ])
        .limit(10)
        .offset(index ? index : 0)
        .orderBy("justificaciones.created_at")
    
    let justificaciones;

    if (filter && search) {
        if (filter === "primer_nombre" || filter === "primer_apellido") {
            query = query.where(`empleados.${filter}`, 'like', `%${search}%`)
        }

        if (filter === 'empleado') {
            query = query.where(`justificaciones.${filter}`, 'like', `%${search}%`)
        }

        if (filter === "nombre" || filter === "apellido" || filter === "usuario") { 
            query = query.where(`usuarios.${filter}`, 'like', `%${search}%`)
        }
    }

    justificaciones = await async(query.execute(), log)

    return {justificaciones};
}) satisfies PageServerLoad;