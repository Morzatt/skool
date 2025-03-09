import { db } from "../";
import type { Asistencia, AsistenciaInsertable, AsistenciaUpdateable } from "../types";

export interface AsistenciasRepositoryInterface {
    create(asistencia: AsistenciaInsertable): Promise<void>
    getById(empleado: string, fecha: string): Promise<Asistencia | undefined>
    getByEmpleado(empleado: string): Promise<Asistencia[] | undefined>
    getByDia(dia: string): Promise<Asistencia[] | undefined>
    delete(empleado: string, fecha: string) : Promise<void>
    setSalida(salida: AsistenciaUpdateable ,empleado: string, fecha: string): Promise<void>
}

export let asistenciasRepository: AsistenciasRepositoryInterface = {
    create: async (asistencia) => {
        try {
            await db.insertInto("asistencias")
                .values(asistencia)
                .execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (empleado, fecha) => {
        try {
            let result = await db.
                selectFrom("asistencias")
                .selectAll()
                .where((eb) => 
                    eb.and([
                        eb('asistencias.empleado', '=', empleado),
                        eb('asistencias.fecha', '=', fecha)
                    ])
                )
                .executeTakeFirst()
            return result
        } catch (error) {
            throw error
        }
    },

    getByEmpleado: async (empleado) => {
        try {
            let result = await db
                .selectFrom("asistencias")
                .selectAll()
                .where("asistencias.empleado", "=", empleado)
                .execute()
           return result 
        } catch (error) {
            throw error
        }
    },

    getByDia: async (dia) => {
        try {
            let result = await db
                .selectFrom("asistencias")
                .selectAll()
                .where("asistencias.fecha", "=", dia)
                .execute()
           return result 
        } catch (error) {
            throw error
        }
    },

    delete: async (empleado, fecha) => {
        try {
            await db
                .deleteFrom("asistencias")
                .where((eb) => 
                    eb.and([
                        eb('asistencias.empleado', '=', empleado),
                        eb('asistencias.fecha', '=', fecha)
                    ])
                )
                .execute()
        } catch (error) {
            throw error
        }
    },

    setSalida: async (salida, empleado, fecha) => {
        try {
            await db
                .updateTable("asistencias")
                .set(salida)
                .where((eb) => 
                    eb.and([
                        eb('asistencias.empleado', '=', empleado),
                        eb('asistencias.fecha', '=', fecha)
                    ])
                )
                .execute()
        } catch (error) {
            throw error
        }
    },
}

