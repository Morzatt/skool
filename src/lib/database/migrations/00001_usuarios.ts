import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('usuarios')
    .addColumn('nombre', 'text', (col) => col.notNull())
    .addColumn('apellido', 'text', (col) => col.notNull())
    .addColumn('usuario', 'varchar(50)', (col) => col.primaryKey().unique())
    .addColumn('contraseña', 'text', (col) => col.notNull())
    .addColumn('role', 'varchar(50)', (col) => col.notNull().defaultTo("Usuario"))
    .addColumn('estado', 'varchar(50)', (col) => col.notNull().defaultTo("Activo").check(sql`estado IN ('Activo', 'Bloqueado')`))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('usuarios').execute()
}