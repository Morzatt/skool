import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    let { log } = locals;
    let index = parseInt(url.searchParams.get('index') as string)
    let filter = url.searchParams.get('filter') as string;
    let search = url.searchParams.get('search') as string;
    let estado = url.searchParams.get('estado') as 'Vigentes' | 'Pendientes' | 'Expiradas' | 'All';

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

    if (search) {
        // AÑADIR BUSQUEDA POR FECHA, TODAS LAS JUSTIFICACIONES QUE HAYAN SIDO REALIZADAS DENTRO DE UNAS FECHAS ESPECIFICADAS
        query = query.where((eb) => eb.or([
            eb(`empleados.primer_nombre`, 'like', `%${search}%`),
            eb(`empleados.primer_apellido`, 'like', `%${search}%`),
            eb(`empleados.segundo_nombre`, 'like', `%${search}%`),
            eb(`empleados.segundo_apellido`, 'like', `%${search}%`),
            eb(`justificaciones.empleado`, 'like', `%${search}%`),

            eb(`usuarios.nombre`, 'like', `%${search}%`),
            eb(`usuarios.apellido`, 'like', `%${search}%`),
            eb(`usuarios.usuario`, 'like', `%${search}%`),

            eb("justificaciones.razon", 'like', `%${search}%`),
            eb("justificaciones.tipo", 'like', `%${search}%`),
        ]))       
    }

    const today = new Date().toISOString().split('T')[0];


    if (estado) {
        if (estado === "Expiradas") {
            query = query.where('justificaciones.fecha_finalizacion', "<", today)
        }

        if (estado === "Pendientes") {
            query = query.where('justificaciones.fecha_inicio', '>', today)
        }

        if (estado === "Vigentes") {
            query = query.where('justificaciones.fecha_inicio', '<', today).where('justificaciones.fecha_finalizacion', '>', today)
        }
    }

    justificaciones = await async(query.execute(), log)
    return { justificaciones };
}) satisfies PageServerLoad;