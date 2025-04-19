import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('asistencias')
    // '30451822_20250418'
    .addColumn('id_asistencia', 'varchar(40)', (col) => col.notNull().primaryKey())
    .addColumn('empleado', 'varchar(12)', (col) => col.notNull())
    .addColumn('fecha', 'date', (col) => col.notNull())
    .addColumn('hora_entrada', 'time', (col) => col.notNull())
    .addColumn('hora_salida', 'time')
    .addColumn('encargado', 'varchar(50)', (col) => col.notNull())
    .addForeignKeyConstraint('fk_empleado', ['empleado'], 'empleados', ["cedula"], (col) => col.onDelete('no action').onUpdate('cascade'))
    .addForeignKeyConstraint('fk_encargado',['encargado'], 'usuarios', ["usuario"], (col) => col.onDelete('no action').onUpdate('cascade'))
    .execute()

  await db.schema
    .createTable('observaciones_asistencias')
    .addColumn('id_asistencia', 'varchar(40)', (col) => col.notNull())
    .addColumn('encargado_observacion', 'varchar(50)', (col) => col.notNull())
    .addColumn('tipo_observacion', 'varchar(12)', (col) => col.notNull().check(sql`tipo_observacion IN ('Entrada', 'Salida')`))
    .addColumn('observacion', 'varchar(50)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addForeignKeyConstraint('fk_asistencia', ['id_asistencia'], 'asistencias', ["id_asistencia"], (col) => col.onDelete('no action').onUpdate('cascade'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('asistencias').execute()
  await db.schema.dropTable('observaciones_asistencias').execute()
}


// CREATE TABLE `asistencias` (
//   `empleado` varchar(12),
//   `fecha` DATE NOT NULL,
//   `hora_entrada` TIME NOT NULL,
//   `hora_salida` TIME,
//   `encargado` varchar(50),
//   CONSTRAINT `fk_empleado` FOREIGN KEY (`empleado`) REFERENCES `empleados` (`cedula`) ON DELETE no action ON UPDATE CASCADE,
//   CONSTRAINT `fk_encargado` FOREIGN KEY (`encargado`) REFERENCES `usuarios` (`usuario`) ON DELETE no action ON UPDATE CASCADE,
//   CONSTRAINT `pkey_asistencias` PRIMARY KEY (`empleado`, `fecha`)
// )
