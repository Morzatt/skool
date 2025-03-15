import type { Transaction } from "kysely"
import { db } from ".."
import type { Comprobante, ComprobanteInsertable, Database, Justificacion, JustificacionInsertable, JustificacionUpdateable } from "../types"

export interface JustificacionesRepositoryInterface {
    create(trx: Transaction<Database>, justificacion: JustificacionInsertable): Promise<void>
    delete(trx: Transaction<Database>, id: string): Promise<void>
    update(data: JustificacionUpdateable, id: string): Promise<void>
    getById(id: string): Promise<Justificacion | undefined>
}

export const justificacionesRepository = {
    create: async (trx ,justificacion) => {
        try {
            await trx.insertInto('justificaciones').values(justificacion).execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (trx, id) => {
        try {
            await trx.deleteFrom('justificaciones').where('justificaciones.id', '=', id).execute()
        } catch (error) {
            throw error
        }
    },

    update: async (data, id) => {
        try {
            await db.updateTable('justificaciones').set(data).where('justificaciones.id', '=', id).execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            let result = await db.selectFrom('justificaciones').selectAll().where('justificaciones.id', '=', id).executeTakeFirst()
            return result
        } catch (error) {
            throw error
        }
    },
} satisfies JustificacionesRepositoryInterface


export interface ComprobantesRepositoryInterface {
    create(trx: Transaction<Database>, comprobantes: ComprobanteInsertable): Promise<void>
    delete(trx: Transaction<Database>, id: string): Promise<void>
    getById(id: string): Promise<Comprobante | undefined>
}

export const comprobantesRepository = {
    create: async (trx, comprobante) => {
        try {
            await trx.insertInto('comprobantes').values(comprobante).execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (trx, id) => {
        try {
            await trx.deleteFrom('comprobantes').where('comprobantes.id_comprobante', '=', id).execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            let result = await db.selectFrom('comprobantes').selectAll().where('comprobantes.id_comprobante', '=', id).executeTakeFirst()
            return result
        } catch (error) {
            throw error
        }
    },
} satisfies ComprobantesRepositoryInterface