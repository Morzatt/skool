import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('preguntas')
    .addColumn('usuario', 'text', (col) => col.notNull())
    .addColumn('preg_1', 'text', (col) => col.notNull())
    .addColumn('res_1', 'text', (col) => col.notNull())
    .addColumn('preg_2', 'text', (col) => col.notNull())
    .addColumn('res_2', 'text', (col) => col.notNull())
    .addForeignKeyConstraint("fk_usuario", ["usuario"], "usuarios", ["usuario"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('preguntas').execute()
}