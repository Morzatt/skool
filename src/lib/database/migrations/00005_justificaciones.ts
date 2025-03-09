import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('justificaciones')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('justificaciones').execute()
}