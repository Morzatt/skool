import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('sessions')
    .addColumn('id', 'char(40)', (col) => col.notNull().primaryKey().defaultTo(sql`UUID()`))
    .addColumn('usuario', 'varchar(50)', (col) => col.notNull())
    .addColumn('created_at', "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn('expires_at', "timestamp", (col) => col.notNull())
    .addColumn('data', "json")
    .addForeignKeyConstraint("fk_usuario_session", ["usuario"], "usuarios", ["usuario"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sessions').execute()
}