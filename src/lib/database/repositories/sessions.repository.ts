import type { SessionInsertable, Session } from "../types";
import { db } from "../";
import { sql } from "kysely";

export interface SessionsRepositoryInterface {
    create(session: SessionInsertable): Promise<undefined>
    get(sessionId: string): Promise<Session | undefined>
    delete(sessionId: string): Promise<void | undefined>
}

export let sessionsRepository: SessionsRepositoryInterface = {
    create: async (session) => {
        try {
            let res = await db.transaction().execute(async (trx) => {
                await trx.insertInto("sessions").values(session).execute()
            })
        } catch (error) {
            throw error
        }
    },

    get: async (sessionId) => {
        try {
            let result = await db.selectFrom("sessions")
                .selectAll()
                .where("sessions.id", "=", sessionId)
                .executeTakeFirst()
            if (result) return result;
        } catch (error) {
            throw error
        }

    },

    delete: async (sessionId) => {
        try {
            let result = await db.deleteFrom("sessions")
                .where("sessions.id", "=", sessionId)
                .execute()
        } catch (error) {
            throw error
        }
    },
}