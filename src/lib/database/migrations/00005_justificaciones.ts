import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('justificaciones')
    .addColumn('empleado', 'varchar(12)')
    .addColumn('id', 'char(40)', (col) => col.notNull().primaryKey().defaultTo(sql`UUID()`))
    .addColumn('tipo', 'text')
    .addColumn('razon', 'text')
    .addColumn('detalles', 'text')
    .addColumn('fecha_inicio', 'text')
    .addColumn('fecha_finalizacion', 'text')

    .addColumn('created_by', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addForeignKeyConstraint('fk_empleado', ['empleado'], 'empleados', ['cedula'], (col) => col.onDelete('cascade').onUpdate('cascade'))
    .execute()

  await db.schema
    .createTable('comprobantes')
    .addColumn('id_justificacion', 'char(40)')
    .addColumn('id_comprobante', 'char(40)')
    .addColumn('path', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addForeignKeyConstraint('fk_justificacion', ['id_justificacion'], 'justificaciones', ['id'], (col) => col.onDelete('cascade').onUpdate('cascade'))
    .addPrimaryKeyConstraint('pk_comprobante', ['id_comprobante', 'id_justificacion'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('justificaciones').execute()
}