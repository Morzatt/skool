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
    info_laboral: InfoLaboralTable,
    info_personal: InfoPersonalTable,
    info_contacto: InfoContactoTable,
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


export type EstadosEmpleado = 'Activo' | 'Por Asignar' | 'Reposo' | 'Inhabilitado' | 'Retirado' | 'Permiso'
 
// Empleados
export type EmpleadosTable = {
    cedula: ColumnType<string, string, never>,
    primer_nombre: string,
    segundo_nombre: string | undefined,
    primer_apellido: string,
    segundo_apellido: string | undefined,
    sexo: "Masculino" | "Femenino",
    edad: string
    nacionalidad: "Extranjero" | "Venezolano"
    fecha_nacimiento: ColumnType<Date, string, never>,
    departamento: string | null,
    cargo: string,
    turno: "Mañana" | "Tarde"
    estado: ColumnType<EstadosEmpleado, never, EstadosEmpleado>,
    created_at: ColumnType<Date, never>
}

export type Empleado = Selectable<EmpleadosTable>
export type EmpleadoInsertable = Insertable<EmpleadosTable>
export type EmpleadoUpdateable = Updateable<EmpleadosTable>

export type InfoPersonalTable= {
    id_empleado: ColumnType<string, string, never>,
    estado_civil: string,
    nivel_academico: string
}

export type InfoPersonal = Selectable<InfoPersonalTable>
export type InfoPersonalInsertable = Insertable<InfoPersonalTable>
export type InfoPersonalUpdateable = Updateable<InfoPersonalTable>

export type InfoContactoTable= {
    id_empleado: ColumnType<string, string, never>,
    direccion_habitacion: string
    telefono_personal: string
    telefono_habitacion: string
    correo_electronico: string
}

export type InfoContacto = Selectable<InfoContactoTable>
export type InfoContactoInsertable = Insertable<InfoContactoTable>
export type InfoContactoUpdateable = Updateable<InfoContactoTable>

export type InfoLaboralTable= {
    id_empleado: ColumnType<string, string, never>,
    fecha_ingreso: ColumnType<string, string | undefined>
    tiempo_servicio: ColumnType<string, string | undefined>
    hora_entrada: ColumnType<string, string | undefined>
    hora_salida: ColumnType<string, string | undefined>
}

export type InfoLaboral = Selectable<InfoLaboralTable>
export type InfoLaboralInsertable = Insertable<InfoLaboralTable>
export type InfoLaboralUpdateable = Updateable<InfoLaboralTable>

// Justificaciones
export type JustificacionesTable = {
    empleado: ColumnType<string, string, never>,
    id: string,
    tipo: string,
    razon: string
    detalles: string
    fecha_inicio: ColumnType<string, string, string>,
    fecha_finalizacion: ColumnType<string, string, string>,
    created_by: string,
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
    id_asistencia: string,
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
    id_asistencia: ColumnType<string, string, never>,
    encargado_observacion: string,
    tipo_observacion: 'Entrada'  | 'Salida' | 'General',
    observacion: string,
    created_at: ColumnType<Date, never>,
}

export type ObservacionAsistencia = Selectable<ObservacionesAsistenciasTable>
export type ObservacionAsistenciaInsertable = Insertable<ObservacionesAsistenciasTable>
export type ObservacinoAsistenciaUpdateable = Updateable<ObservacionesAsistenciasTable>