import { db } from '$lib/database';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { printAsistenciasHandler } from '$lib/handlers/print.handlers';

// Consolidated interfaces
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
    statusCode?: string;
    statusColor?: string;
}

interface AttendanceType {
    codigo: string;
    label: string;
    color: string;
}

interface DayInfo {
    day: string;
    month: number;
    year: number;
    weekday: string;
    isWeekend: boolean;
}

// Define types for exported data
interface AsistenciasPageData {
    empleados: Employee[];
    filteredEmpleados: Employee[];
    asistencias: Attendance[];
    asistenciasHoy: number;
    departamentos: Departamento[];
    tiposAsistencia: AttendanceType[];
    dateRange: { startDate: Date; endDate: Date; };
    dateRangeDays: DayInfo[];
}

// Define attendance types once to reuse
const ATTENDANCE_TYPES: AttendanceType[] = [
    { codigo: 'PR',  label: 'Presente', color: 'bg-success' },
    { codigo: 'AUS', label: 'Ausente', color: 'bg-error' },
    { codigo: 'PER', label: 'Permiso', color: 'bg-warning' },
    { codigo: 'VAC', label: 'Vacaciones', color: 'bg-info' },
    { codigo: 'RET', label: 'Retardo', color: 'bg-secondary' },
    { codigo: 'LIB', label: 'Libre', color: 'bg-neutral' },
    { codigo: 'FER', label: 'Feriado', color: 'bg-accent' }
];

// Weekday labels for calendar
const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export const load: PageServerLoad = async ({ url }): Promise<AsistenciasPageData> => {
    try {
        // Parse URL params
        const params = {
            startDate: url.searchParams.get('startDate'),
            endDate: url.searchParams.get('endDate'),
            search: url.searchParams.get('search') || '',
            departamento: url.searchParams.get('departamento') || 'all'
        };
        
        const today = new Date().toISOString().split('T')[0];

        // Set date range with defaults
        const endDate = params.endDate ? new Date(params.endDate.replaceAll('-', '/')) : new Date(new Date(today).getFullYear(), new Date(today).getMonth() + 1, 0);
        const startDate = params.startDate 
            ? new Date(params.startDate.replaceAll('-', '/')) 
            : new Date(new Date(today).getFullYear(), new Date(today).getMonth(), 1);

        
        // Format dates for queries
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        
        // DB queries - run in parallel
        const [empleados, departamentos, asistencias, asistenciasHoy] = await Promise.all([
            // Employees with departments
            db.selectFrom('empleados')
                .leftJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
                .select([
                    'empleados.cedula as id',
                    'empleados.primer_nombre as nombres',
                    'empleados.primer_apellido as apellidos',
                    'empleados.nacionalidad',
                    'empleados.cargo',
                    'empleados.turno',
                    'departamentos.nombre_departamento as departamento_nombre',
                    'departamentos.id_departamento as departamento_id'
                ])
                .orderBy('empleados.primer_apellido')
                .execute(),
                
            // All departments
            db.selectFrom('departamentos')
                .select([
                    'id_departamento as id',
                    'nombre_departamento as nombre'
                ])
                .orderBy('nombre_departamento')
                .execute(),
                
            // Attendance records in date range
            db.selectFrom('asistencias')
                .select([
                    'asistencias.empleado as empleado_id',
                    'asistencias.fecha',
                    'asistencias.hora_entrada',
                    'asistencias.hora_salida',
                    'asistencias.encargado'
                ])
                .where('asistencias.fecha', '>=', startDateStr)
                .where('asistencias.fecha', '<=', endDateStr)
                .execute(),
                
            // Today's attendance count
            db.selectFrom('asistencias')
                .select(db.fn.count('empleado').as('count'))
                .where('fecha', '=', today)
                .executeTakeFirst()
        ]);
        
        // Generate days array for the date range
        const dateRangeDays = generateDaysArray(startDate, endDate);
        
        // Process attendance records with status codes
        const processedAsistencias = processAttendanceRecords(asistencias);
        
        // Filter employees based on search/department
        const filteredEmpleados = filterEmployees(empleados, params.search, params.departamento);
        
        return {
            empleados: empleados as Employee[],
            filteredEmpleados: filteredEmpleados as Employee[],
            asistencias: processedAsistencias as Attendance[],
            asistenciasHoy: asistenciasHoy?.count as number || 0,
            departamentos: departamentos as Departamento[],
            tiposAsistencia: ATTENDANCE_TYPES,
            dateRange: { startDate, endDate },
            dateRangeDays
        };
    } catch (err) {
        console.error('Error loading attendance data:', err);
        throw error(500, 'Error loading attendance data');
    }
};

// Helper functions
function generateDaysArray(startDate: Date, endDate: Date): DayInfo[] {
    const days: DayInfo[] = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toISOString() === end.toISOString()) {
        days.push({
            day: start.getDate().toString().padStart(2, '0'),
            month: start.getMonth(),
            year: start.getFullYear(),
            weekday: WEEKDAYS[start.getDay()],
            isWeekend: start.getDay() === 0 || start.getDay() === 6
        });

        return days
    }

    // Set time boundaries for accurate comparison
    start.setHours(0, 0, 1, 1);
    end.setHours(23, 59, 59, 999);

    const current = new Date(start);
    while (current <= end) {
        const day = current.getDate().toString().padStart(2, '0');
        const month = current.getMonth();
        const year = current.getFullYear();
        const dayOfWeek = current.getDay();
        
        days.push({
            day,
            month,
            year,
            weekday: WEEKDAYS[dayOfWeek],
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6
        });
        
        current.setDate(current.getDate() + 1);
    }
    
    return days;
}

function processAttendanceRecords(asistencias: any[]): Attendance[] {
    return asistencias.map(attendance => {
        // Determine status code based on entry/exit times
        const statusCode = attendance.hora_entrada 
            ? 'PR'  // Present (with or without exit time)
            : 'AUS'; // Absent
        
        // Find color for the status
        const type = ATTENDANCE_TYPES.find(t => t.codigo === statusCode);
        
        return {
            ...attendance,
            statusCode,
            statusColor: type?.color
        };
    });
}

function filterEmployees(empleados: any[], searchTerm: string, departamento: string): Employee[] {
    return empleados.filter(emp => {
        // Text search filter - check against name, surname, and ID
        const matchesSearch = !searchTerm || 
            emp.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.id.includes(searchTerm);
        
        // Department filter
        const matchesDepartment = departamento === "all" || 
            emp.departamento_id === departamento;
        
        return matchesSearch && matchesDepartment;
    });
}


export const actions = {
    printAsistencias: printAsistenciasHandler,
} satisfies Actions