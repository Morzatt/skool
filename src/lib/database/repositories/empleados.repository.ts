import { db } from "../";
import type { Departamento, DepartamentoInsertable, Empleado, EmpleadoInsertable, EmpleadoUpdateable, InsertPregSeg, PregSeg, UpdatePregSeg } from "../types";

export interface EmpleadosRepositoryInterface {
    create(empleado: EmpleadoInsertable): Promise<void>
    getById(id: string): Promise<Empleado | undefined>
    delete(id: string) : Promise<void>
    update(data: EmpleadoUpdateable, id: string): Promise<void>
}

export let empleadosRepository: EmpleadosRepositoryInterface = {
    create: async (empleado) => {
        try {
            await db.insertInto("empleados")
                .values(empleado)
                .execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            let result = await db.
                selectFrom("empleados")
                .selectAll()
                .where("empleados.cedula", "=", id)
                .executeTakeFirst()
            return result
        } catch (error) {
            throw error
        }
    },

    update: async (data, id) => {
        try {
            await db
                .updateTable("empleados")
                .set(data)
                .where("empleados.cedula", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            await db
                .deleteFrom("empleados")
                .where("empleados.cedula", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },
}


export interface DepaartamentosRepositoryInterface {
    create(departamento: DepartamentoInsertable): Promise<void>
    getById(id: string): Promise<Departamento | undefined>
    delete(id: string) : Promise<void>
    changeName(newName: string, id: string): Promise<void>
}

export let departamentosRepository: DepaartamentosRepositoryInterface = {
    create: async (dep) => {
        try {
            await db.insertInto("departamentos")
                .values(dep)
                .execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            let result = await db.
                selectFrom("departamentos")
                .selectAll()
                .where("departamentos.id_departamento", "=", id)
                .executeTakeFirst()
            return result
        } catch (error) {
            throw error
        }
    },

    changeName: async (newName, id) => {
        try {
            await db
                .updateTable("departamentos")
                .set({nombre_departamento: newName})
                .where("departamentos.id_departamento", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            await db
                .deleteFrom("departamentos")
                .where("departamentos.id_departamento", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },
}