import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { sql } from 'kysely';

export const load = (async ({ locals }) => {
    let { log } = locals;

    const result = await db
        .selectFrom('departamentos as d')
        .select([
            'd.nombre_departamento as departamento',
            'd.id_departamento',
            'd.icon as icon_departamento',
            // Subconsulta para obtener los empleados anidados con sus asistencias
            sql<number>`
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                    'cedula', e.cedula,
                    'nacionalidad', e.nacionalidad,
                    'primer_nombre', e.primer_nombre,
                    'primer_apellido', e.primer_apellido,
                    'cargo', e.cargo,
                    'asistencias', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'fecha', DATE_FORMAT(a.fecha, '%d-%m-%Y'),
                                'hora_entrada', a.hora_entrada,
                                'hora_salida', a.hora_salida
                            )
                        )
                        FROM asistencias as a
                        WHERE a.empleado = e.cedula
                        ORDER BY a.fecha
                    )
            )
            )
                FROM empleados as e
                WHERE e.departamento = d.id_departamento
                ORDER BY e.cedula
            )`
            .as('empleados')
        ])
        .execute();

        console.log(result)

    // Get all employees with their departments
    const empleados = await async(
        db
            .selectFrom('empleados')
            .innerJoin('departamentos', 'departamentos.id_departamento', 'empleados.departamento')
            .selectAll('empleados')
            .select(['departamentos.nombre_departamento', 'departamentos.id_departamento'])
            .orderBy('empleados.primer_apellido')
            .execute()
        , log) || [];

    // Get all attendance records
    const asistencias = await async(
        db
            .selectFrom('asistencias')
            .selectAll()
            .execute()
        , log) || [];

    // Calculate attendance for today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const asistenciasHoy = asistencias.filter(a =>
        new Date(a.fecha).toISOString().split('T')[0] === todayStr
    ).length;

    let departamentos = await async(db.selectFrom('departamentos').selectAll().execute(), log)
    
    return {
        empleados,
        asistencias,
        asistenciasHoy,
        departamentos,
        result
    };
}) satisfies PageServerLoad;