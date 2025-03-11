import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('empleados')
    .addColumn('cedula', 'varchar(12)', (col) => col.notNull().primaryKey())
    .addColumn('primer_nombre', 'text', (col) => col.notNull())
    .addColumn('segundo_nombre', 'text')
    .addColumn('primer_apellido', 'text', (col) => col.notNull())
    .addColumn('segundo_apellido', 'text')
    .addColumn('sexo', 'varchar(25)', (col) => col.notNull().check(sql`sexo IN ('Masculino', 'Femenino')`))
    .addColumn('edad', 'varchar(2)', (col) => col.notNull())
    .addColumn('nacionalidad', 'varchar(15)', (col) => col.notNull().check(sql`nacionalidad IN ('Extranjero', 'Venezolano')`))
    .addColumn('fecha_nacimiento', 'date', (col) => col.notNull())

    .addColumn('departamento', 'varchar(40)', (col) => col.defaultTo('No Asignado'))
    .addColumn('cargo', 'varchar(100)', (col) => col.notNull())
    .addColumn('turno', 'varchar(20)', (col) => col.notNull().check(sql`turno IN  ('Mañana', 'Tarde')`))
    .addColumn('estado', 'varchar(25)', (col) => col.notNull().defaultTo("Por Asignar").check(sql`estado IN ('Activo', 'Reposo', 'Inhabilitado', 'Despedido', 'No Asignado')`))

    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )

    .addForeignKeyConstraint('fk_departamento', ['departamento'], 'departamentos', ['id_departamento'], (col) => col.onDelete("set null").onUpdate("cascade"))
    .execute()

  await db.schema
    .createTable('departamentos')
    .addColumn('id_departamento', 'varchar(40)', (col) => col.notNull().primaryKey())
    .addColumn('nombre_departamento', 'varchar(50)', (col) => col.notNull())
    .addColumn('icon', 'varchar(120)', (col) => col.notNull())
    .addColumn('descripcion', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('empleados').execute()
  await db.schema.dropTable('departamentos').execute()
}