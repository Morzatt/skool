import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('asistencias')
    .addColumn('empleado', 'varchar(12)')
    .addColumn('fecha', 'date', (col) => col.notNull())
    .addColumn('hora_entrada', 'time', (col) => col.notNull())
    .addColumn('hora_salida', 'time')
    .addColumn('encargado', 'varchar(50)')
    .addForeignKeyConstraint('fk_empleado', ['empleado'], 'empleados', ["cedula"], (col) => col.onDelete('no action').onUpdate('cascade'))
    .addForeignKeyConstraint('fk_encargado',['encargado'], 'usuarios', ["usuario"], (col) => col.onDelete('no action').onUpdate('cascade'))
    .addPrimaryKeyConstraint('pkey_asistencias', ['empleado', 'fecha'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('justificaciones').execute()
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