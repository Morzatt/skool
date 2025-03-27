import { db } from '$lib/database';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Employee {
    id: string;
    nombres: string;
    apellidos: string;
    cargo?: string;
    turno?: string;
    departamento_id?: string;
    departamento_nombre?: string;
}

interface Departamento {
    id: string;
    nombre: string;
}

interface Attendance {
    empleado_id: string;
    fecha: string;
    hora_entrada?: string;
    hora_salida?: string;
    encargado?: string;
}

interface AttendanceType {
    codigo: string;
    label: string;
    color: string;
}

interface AsistenciasPageData {
    empleados: Employee[];
    asistencias: Attendance[];
    asistenciasHoy: number;
    departamentos: Departamento[];
    tiposAsistencia: AttendanceType[];
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
}

export const load: PageServerLoad = async ({ url }): Promise<AsistenciasPageData> => {
    try {
        // Parse date range from URL query params
        const startDateParam = url.searchParams.get('startDate');
        const endDateParam = url.searchParams.get('endDate');
        
        // Set default date range (last 7 days) if not provided
        const endDate = endDateParam ? new Date(endDateParam) : new Date();
        
        let startDate: Date;
        if (startDateParam) {
            startDate = new Date(startDateParam);
        } else {
            startDate = new Date();
            startDate.setDate(endDate.getDate() - 6); // Last 7 days by default
        }
        
        // Format dates for SQL query
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Fetch all employees with their departments
        const empleados = await db
            .selectFrom('empleados')
            .leftJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
            .select([
                'empleados.cedula as id',
                'empleados.primer_nombre as nombres',
                'empleados.primer_apellido as apellidos',
                'empleados.cargo',
                'empleados.turno',
                'departamentos.nombre_departamento as departamento_nombre',
                'departamentos.id_departamento as departamento_id'
            ])
            .orderBy('empleados.primer_apellido')
            .execute();
        
        // Fetch all departments for filtering
        const departamentos = await db
            .selectFrom('departamentos')
            .select([
                'id_departamento as id',
                'nombre_departamento as nombre'
            ])
            .orderBy('nombre_departamento')
            .execute();
        
        // Fetch all attendance records in date range without the non-existent observaciones_asistencias table
        const asistencias = await db
            .selectFrom('asistencias')
            .select([
                'asistencias.empleado as empleado_id',
                'asistencias.fecha',
                'asistencias.hora_entrada',
                'asistencias.hora_salida',
                'asistencias.encargado'
            ])
            .where('asistencias.fecha', '>=', startDateStr)
            .where('asistencias.fecha', '<=', endDateStr)
            .execute();
        
        // Count attendance for today
        const today = new Date().toISOString().split('T')[0];
        const asistenciasHoy = await db
            .selectFrom('asistencias')
            .select(db.fn.count('empleado').as('count'))
            .where('fecha', '=', today)
            .executeTakeFirst();
        
        // Define attendance status types with colors and codes
        const tiposAsistencia: AttendanceType[] = [
            { codigo: 'PR', label: 'Presente', color: 'bg-success' },
            { codigo: 'AUS', label: 'Ausente', color: 'bg-error' },
            { codigo: 'PER', label: 'Permiso', color: 'bg-warning' },
            { codigo: 'VAC', label: 'Vacaciones', color: 'bg-info' },
            { codigo: 'RET', label: 'Retardo', color: 'bg-secondary' },
            { codigo: 'LIB', label: 'Libre', color: 'bg-neutral' },
            { codigo: 'FER', label: 'Feriado', color: 'bg-accent' }
        ];
        
        return {
            empleados: empleados as Employee[],
            asistencias: asistencias as Attendance[],
            asistenciasHoy: asistenciasHoy?.count as number || 0,
            departamentos: departamentos as Departamento[],
            tiposAsistencia,
            dateRange: {
                startDate,
                endDate
            }
        };
    } catch (err) {
        console.error('Error loading attendance data:', err);
        throw error(500, 'Error loading attendance data');
    }
};