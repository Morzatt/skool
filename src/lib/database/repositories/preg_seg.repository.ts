import { db } from "../";
import type { InsertPregSeg, PregSeg, UpdatePregSeg } from "../types";

export interface PregSegRepositoryInterface {
    insert(usuario: PregSeg): Promise<void>
    get(usuario: string): Promise<PregSeg | undefined>
    update(pregseg: UpdatePregSeg, usuario: string): Promise<void>
}

export let pregSegRepository: PregSegRepositoryInterface = {
    insert: async (preguntas: InsertPregSeg): Promise<void> => {
        try {
            await db.insertInto("preguntas")
                .values(preguntas)
                .execute()
        } catch (error) {
            throw error
        }
    },

    get: async (usuario: string): Promise<PregSeg | undefined> => {
        try {
            let result = await db.
                selectFrom("preguntas")
                .selectAll()
                .where("preguntas.usuario", "=", usuario)
                .executeTakeFirst()
            return result
        } catch (error) {
            throw error
        }
    },

    update: async (pregseg, usuario) => {
        try {
            await db
                .updateTable("preguntas")
                .set(pregseg)
                .where("usuario", "=", usuario)
                .execute()
        } catch (error) {
            throw error
        }
    },
}