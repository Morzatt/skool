import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { eachDayOfInterval, format, getDaysInYear, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    let { log } = locals

    let today = new Date()
    let relacionAsistencias = await async(
        db.transaction().execute(async (trx) => {
            let primerDiaDelMes = startOfMonth(today)
            let diasDelMes = obtenerDiferenciaDeDias(primerDiaDelMes, today, 'dd').length

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

    console.log(relacionAsistencias)

    return { usuario: locals.usuario, relacionAsistencias };
}) satisfies LayoutServerLoad;

function obtenerDiferenciaDeDias(inicio: Date, fin: Date, formatType: string) {

    const diasDelMes = eachDayOfInterval({
        start: inicio,
        end: fin
    });

    // Formatear cada fecha como string (ejemplo: "2023-04-01")
    return diasDelMes.map(fecha => format(fecha, formatType));
}