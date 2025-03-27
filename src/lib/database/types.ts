import type { 
    ColumnType,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    usuarios: UsuariosTable,
    preguntas: PreguntasSeguridadTable,
    sessions: SessionsTable,
    empleados: EmpleadosTable,
    justificaciones: JustificacionesTable,
    comprobantes: ComprobantesTable,
    departamentos: DepartamentosTable,
    asistencias: AsistenciasTable
    observaciones_asistencias: ObservacionesAsistenciasTable
}

type Roles = "superadmin" | "administrador" | "editor" | "usuario"

// Usuarios
export type UsuariosTable = {
    nombre: string
    apellido: string
    usuario: string
    contraseña: string
    role: ColumnType<string, never, string>
    estado: ColumnType<Estados, never>
    created_at: ColumnType<Date, never>,
}

type Estados = "Activo" | "Bloqueado"
export type Usuario = Selectable<UsuariosTable>
export type NewUsuario = Insertable<UsuariosTable>
export type UpdateUsuario = Updateable<UsuariosTable>

// Preguntas de Seguridad
export type PreguntasSeguridadTable = {
    usuario: ColumnType<string, string, never>,
    preg_1: ColumnType<string, string>,
    res_1: ColumnType<string, string>,
    preg_2: ColumnType<string, string>,
    res_2: ColumnType<string, string>,
}
export type PregSeg = Selectable<PreguntasSeguridadTable>
export type InsertPregSeg = Insertable<PreguntasSeguridadTable>
export type UpdatePregSeg = Updateable<PreguntasSeguridadTable>

// Sessions 
export type SessionsTable = {
    usuario: ColumnType<string, string, never>,
    id: ColumnType<string, string | undefined, never>,
    created_at: ColumnType<Date, never, never>,
    expires_at: ColumnType<Date, string>,
    data: JSONColumnType<Usuario> | undefined
}

export type Session = Selectable<SessionsTable>
export type SessionInsertable = Insertable<SessionsTable>
export type SessionUpdateable = Updateable<SessionsTable>


export type EstadosEmpleado ='Activo'| 'Reposo'| 'Inhabilitado'| 'Despedido' | "Por Asignar" 
// Empleados
export type EmpleadosTable = {
    cedula: ColumnType<string, string, never>,
    primer_nombre: string,
    segundo_nombre: string,
    primer_apellido: string,
    segundo_apellido: string,
    sexo: "Masculino" | "Femenino",
    edad: string
    nacionalidad: "Extranjero" | "Venezolano"
    fecha_nacimiento: ColumnType<Date, string, never>,
    departamento: string,
    cargo: string,
    turno: "Mañana" | "Tarde"
    estado: ColumnType<EstadosEmpleado, never, EstadosEmpleado>,
    created_at: ColumnType<Date, never>
}

export type Empleado = Selectable<EmpleadosTable>
export type EmpleadoInsertable = Insertable<EmpleadosTable>
export type EmpleadoUpdateable = Updateable<EmpleadosTable>


// Justificaciones
export type JustificacionesTable = {
    empleado: ColumnType<string, string, never>,
    id: string,
    tipo: string,
    razon: string
    detalles: string
    fecha_inicio: string,
    fecha_finalizacion: string,
    created_at: ColumnType<Date, never>,
}

export type Justificacion = Selectable<JustificacionesTable>
export type JustificacionInsertable = Insertable<JustificacionesTable>
export type JustificacionUpdateable = Updateable<JustificacionesTable>

// Comprobantes
export type ComprobantesTable = {
    id_justificacion: string,
    id_comprobante: string,
    path: string
    created_at: ColumnType<Date, never>,
}

export type Comprobante = Selectable<ComprobantesTable>
export type ComprobanteInsertable = Insertable<ComprobantesTable>
export type ComprobanteUpdateable = Updateable<ComprobantesTable>


// Departamentos
export type DepartamentosTable = {
    id_departamento: ColumnType<string, string, never>
    nombre_departamento: string,
    descripcion: string,
    icon: string
}

export type Departamento = Selectable<DepartamentosTable>
export type DepartamentoInsertable = Insertable<DepartamentosTable>
export type DepartamentoUpdateable = Updateable<DepartamentosTable>



// Asistencias
export type AsistenciasTable = {
    empleado: ColumnType<string, string, never>,
    fecha: ColumnType<string, string, never>,
    hora_entrada: ColumnType<string, string, never>,
    hora_salida: string | undefined,
    encargado: ColumnType<string, string, never>,
}

export type Asistencia = Selectable<AsistenciasTable>
export type AsistenciaInsertable = Insertable<AsistenciasTable>
export type AsistenciaUpdateable = Updateable<AsistenciasTable>

export type ObservacionesAsistenciasTable = {
    empleado: ColumnType<string, string, never>,
    fecha: ColumnType<string, string, never>,
    hora_entrada: ColumnType<string, string, never>,
    hora_salida: string | undefined,
    encargado: ColumnType<string, string, never>,
}

export type ObservacionAsistencia = Selectable<ObservacionesAsistenciasTable>
export type ObservacionAsistenciaInsertable = Insertable<ObservacionesAsistenciasTable>
export type ObservacinoAsistenciaUpdateable = Updateable<ObservacionesAsistenciasTable>