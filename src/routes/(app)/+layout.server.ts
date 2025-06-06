import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { eachDayOfInterval, endOfDay, format, getDaysInYear, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import type { LayoutServerLoad } from './$types';
import { sql } from 'kysely';

export const load = (async ({ locals }) => {
    let { log, usuario } = locals

    let today = new Date()
    let primerDiaDelMes = startOfMonth(today)
    let diasDelMes = obtenerDiferenciaDeDias(primerDiaDelMes, today, 'dd').length

    let relacionAsistencias = await async(
        db.transaction().execute(async (trx) => {
            // TOTAL DE ASISTENCIAS 
            let total = 0

            let totalEmpleados = await 
            trx
            .selectFrom('empleados')
            .select('empleados.cedula')
            .execute()

            // SUMA DE AUSENCIAS DE TODOS LOS EMPLEADOS
            let ausencias: number = 0;

            // SUMA DE RETARDOS DE TODOS LOS EMPLEADOS
            let retardos: number = 0;

            if(totalEmpleados && totalEmpleados.length > 0) {
                for (let empleado of totalEmpleados) {
                    let info_laboral = await trx.selectFrom('info_laboral')
                    .selectAll()
                    .where('info_laboral.id_empleado', '=', empleado.cedula)
                    .executeTakeFirst()

                    // AUSENCIAS DEL EMPLEADO ESPECIFICO
                    let ausenciasEmpleado = 0;

                    // RETARDOS DEL EMPLEADO ESPECIFICO
                    let retardosEmpleado = 0;

                    // RETARDOS DEL EMPLEADO ESPECIFICO
                    let totalEmpleado = 0;

                    // SI ES EL MISMO MES SERAN LAS ASISTENCIAS DESDE QUE SE CREO
                    if (new Date(info_laboral!.fecha_ingreso).getMonth() === today.getMonth()) {
                        let diasDesdeIngreso = obtenerDiferenciaDeDias(new Date(info_laboral!.fecha_ingreso), today, 'dd').length

                        let totalAsistenciasEmpleado = await trx
                        .selectFrom("asistencias")
                        .where('asistencias.empleado', '=', empleado.cedula)
                        .where((eb) => eb.and([
                            eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                            eb('asistencias.fecha', '<=', today.toISOString().split('T')[0])
                        ]))
                        .select('asistencias.empleado')
                        .execute()

                        ausenciasEmpleado += (diasDesdeIngreso - totalAsistenciasEmpleado!.length)

                        if (info_laboral && info_laboral.hora_entrada) {
                            let totalRetardosEmpleado = await trx
                            .selectFrom("asistencias")
                            .where('asistencias.empleado', '=', empleado.cedula)
                            .where((eb) => eb.and([
                                eb('asistencias.hora_entrada', '>', info_laboral!.hora_entrada)
                            ]))
                            .where((eb) => eb.and([
                                eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                                eb('asistencias.fecha', '<=', today.toISOString().split('T')[0])
                            ]))
                            .select('asistencias.empleado')
                            .execute()

                            retardosEmpleado += totalRetardosEmpleado.length;

                            let totalAsistenciasExitosasEmpleado = await trx
                            .selectFrom("asistencias")
                            .where('asistencias.empleado', '=', empleado.cedula)
                            .where((eb) => eb.and([
                                eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                                eb('asistencias.fecha', '<=', today.toISOString().split('T')[0]),
                                eb('asistencias.hora_entrada', '<=', info_laboral!.hora_entrada)
                            ]))
                            .selectAll()
                            .execute();
                            totalEmpleado += totalAsistenciasExitosasEmpleado.length;
                        } else {
                            let totalAsistenciasExitosasEmpleado = await trx
                            .selectFrom("asistencias")
                            .where('asistencias.empleado', '=', empleado.cedula)
                            .where((eb) => eb.and([
                                eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                                eb('asistencias.fecha', '<=', today.toISOString().split('T')[0]),
                            ]))
                            .selectAll()
                            .execute();
                            totalEmpleado += totalAsistenciasExitosasEmpleado.length;
                        }

                    } else { // SI EL AÑO ES ANTERIOR ANTONCES SERAN LAS ASISTENCIAS DE ESTE AÑO
                        let primerDiaDelMes = startOfMonth(today)
                        let diasDesdeIngreso = obtenerDiferenciaDeDias(primerDiaDelMes, today, 'dd').length

                        let totalAsistenciasEmpleado = await trx
                        .selectFrom("asistencias")
                        .where('asistencias.empleado', '=', empleado.cedula)
                        .where((eb) => eb.and([
                            eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                            eb('asistencias.fecha', '<=', today.toISOString().split('T')[0])
                        ]))
                        .select('asistencias.empleado')
                        .execute()

                        ausenciasEmpleado += (diasDesdeIngreso - totalAsistenciasEmpleado!.length)

                        if (info_laboral && info_laboral.hora_entrada) {
                            let totalRetardosEmpleado = await trx
                            .selectFrom("asistencias")
                            .where('asistencias.empleado', '=', empleado.cedula)
                            .where((eb) => eb.and([
                                eb('asistencias.hora_entrada', '>', info_laboral!.hora_entrada)
                            ]))
                            .where((eb) => eb.and([
                                eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                                eb('asistencias.fecha', '<=', today.toISOString().split('T')[0])
                            ]))
                            .select('asistencias.empleado')
                            .execute()

                            retardosEmpleado += totalRetardosEmpleado.length;

                            let totalAsistenciasExitosasEmpleado = await trx
                            .selectFrom("asistencias")
                            .where('asistencias.empleado', '=', empleado.cedula)
                            .where((eb) => eb.and([
                                eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                                eb('asistencias.fecha', '<=', today.toISOString().split('T')[0]),
                                eb('asistencias.hora_entrada', '<=', info_laboral!.hora_entrada)
                            ]))
                            .selectAll()
                            .execute();
                            totalEmpleado += totalAsistenciasExitosasEmpleado.length;

                        } else {
                            let totalAsistenciasExitosasEmpleado = await trx
                            .selectFrom("asistencias")
                            .where('asistencias.empleado', '=', empleado.cedula)
                            .where((eb) => eb.and([
                                eb('asistencias.fecha', '>=', primerDiaDelMes.toISOString().split('T')[0]),
                                eb('asistencias.fecha', '<=', today.toISOString().split('T')[0]),
                            ]))
                            .selectAll()
                            .execute();
                            totalEmpleado += totalAsistenciasExitosasEmpleado.length;
                        }
                    }

                    ausencias += ausenciasEmpleado;
                    retardos += retardosEmpleado;
                    total += totalEmpleado;
                }
            }

            let totalDias = diasDelMes * totalEmpleados.length

            return { total, ausencias, retardos, totalDias }
        })
    , log)

    const mayoresAsistencias = await db
        .selectFrom('empleados')
        .leftJoin(
            (eb) => eb // eb es el ExpressionBuilder para la subconsulta
                .selectFrom('asistencias')
                .select([
                    'asistencias.empleado', // La cédula del empleado para el join
                    eb.fn.count('asistencias.id_asistencia').as('conteo_asistencias_empleado')
                ])
                .groupBy('asistencias.empleado') // Agrupamos por empleado para contar correctamente
                .as('conteo_sub'), // Alias para la subconsulta completa
            (join) => join.onRef('conteo_sub.empleado', '=', 'empleados.cedula')
        )
        .select((eb) => [
            'empleados.cedula',
            'empleados.primer_nombre',
            'empleados.segundo_nombre',
            'empleados.primer_apellido',
            'empleados.segundo_apellido',
            'empleados.cargo',
            'empleados.estado',
            'empleados.departamento', // Este es el ID del departamento (varchar(40))
            eb.fn.coalesce('conteo_sub.conteo_asistencias_empleado', sql.lit(0)).as('total_asistencias')
        ])
        .orderBy('empleados.primer_apellido', 'asc')
        .orderBy('empleados.primer_nombre', 'asc')
        .limit(5)
        .execute()

    const latestAsistencias = await db
    .selectFrom('asistencias')
    .innerJoin('empleados', 'empleados.cedula', 'asistencias.empleado')
    .leftJoin("info_laboral", 'empleados.cedula', 'info_laboral.id_empleado')
    .selectAll(['empleados', 'asistencias'])
    .select(['info_laboral.hora_entrada as entrada_estimada', 'info_laboral.hora_salida as salida_estimada'])
    .orderBy('asistencias.fecha', 'desc')
    .orderBy('asistencias.hora_entrada', 'desc')
    .where((eb) => eb.and([
        eb('asistencias.fecha', '>=', startOfDay(today).toISOString().split('T')[0]),
        eb('asistencias.fecha', '<=', endOfDay(today).toISOString().split('T')[0]),
    ]))
    .limit(15)
    .execute();

    let distribucionAsistencias = (await getAsistenciasPorMes())

    let asistenciasUsuario = await async(
        db.transaction().execute(async (trx) => {
            let asistencias = await trx
            .selectFrom('asistencias')
            .select("id_asistencia")
            .where('asistencias.encargado', '=', usuario.usuario)
            .execute()

            let observaciones = await trx
            .selectFrom("observaciones_asistencias")
            .select("id_asistencia")
            .where("observaciones_asistencias.encargado_observacion", '=', usuario.usuario)
            .execute()

            return { asistencias: asistencias.length, observaciones: observaciones.length }
        })
    ,log)

    return { usuario: locals.usuario, relacionAsistencias, mayoresAsistencias, latestAsistencias, distribucionAsistencias, asistenciasUsuario };
}) satisfies LayoutServerLoad;

function obtenerDiferenciaDeDias(inicio: Date, fin: Date, formatType: string) {

    const diasDelMes = eachDayOfInterval({
        start: inicio,
        end: fin
    });

    // Formatear cada fecha como string (ejemplo: "2023-04-01")
    return diasDelMes.map(fecha => format(fecha, formatType));
}

async function getAsistenciasPorMes(): Promise<{ labels: string[], datasets: any[] }> {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const year = new Date().getFullYear();

    const results = await db
        .selectFrom('asistencias')
        .select([
            sql<number>`EXTRACT(MONTH FROM fecha)`.as('mes'),
            db.fn.count('asistencias.id_asistencia').as('cantidad')
        ])
        .where(sql<number>`EXTRACT(YEAR FROM fecha)`, '=', year)
        .groupBy('mes')
        .orderBy('mes')
        .execute();

    const counts = Array(12).fill(0);
    for (const row of results) {
        const mesIdx = (typeof row.mes === 'string' ? parseInt(row.mes) : row.mes) - 1;
        if (mesIdx >= 0 && mesIdx < 12) {
            counts[mesIdx] = Number(row.cantidad);
        }
    }

    return {
        labels: meses.map((i) => { return i.slice(0, 3) }),
        datasets: [{
            label: `Distribución de Asistencias ${year}`,
            data: counts,
            borderWidth: 1
        }]
    };
}

