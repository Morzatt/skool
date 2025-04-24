import { db } from "$lib/database";
import async from "$lib/utils/asyncHandler";
import type { RequestEvent } from "@sveltejs/kit";
import path from "path"
import { printListadeAsistencias } from "./pdf";
import { unlinkSync } from "fs";

export type AsistenciaEmpleado = {
    nombre: string,
    cedula: string, 
    hora_entrada: string,
    hora_salida: string
}

export type AsistenciaDia = {
    fecha: Date,
    dia: string,
    empleados: AsistenciaEmpleado[]
}

export type AsistenciaDepartamento = {
    departamento: string,
    lapso: string,
    asistencias: AsistenciaDia[]
}

export async function printAsistenciasHandler({ locals, request, url }: RequestEvent) {
    const { log, response } = locals;
    const data = await request.formData();

    // Get date parameters with defaults
    const { startDate, endDate, dateRange } = getDateRange(data);
    
    // Query database for attendance records
    const records = await fetchAttendanceRecords(startDate, endDate, log);
    
    // Generate PDF file name and path
    const timeId = generateTimeId();
    const pdfPath = path.join(process.cwd(), `/static/temporal/asistencias_${timeId}.pdf`);
    
    // Group attendance records by department and day
    const departmentAttendance = processAttendanceRecords(records, dateRange);
    
    // Check if we found any records
    if (departmentAttendance.length < 1) {
        return response.error('No existen asistencias en el tiempo especificado');
    }
    
    // Generate and serve PDF
    printListadeAsistencias(departmentAttendance, pdfPath);
    
    // Schedule cleanup
    setTimeout(() => unlinkSync(pdfPath), 10000);
    
    return response.success("Horario impreso correctamente", { documentId: timeId });
}

/**
 * Parse request data and calculate date range with defaults
 */
function getDateRange(formData: FormData) {
    const params = {
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        search: formData.get('search') || '' as string,
        departamento: formData.get('departamento') || 'all' as string,
    };

    const today = new Date().toISOString().split('T')[0];

    // Set default dates if not provided
    const endDate = params.endDate 
        ? new Date(params.endDate.replaceAll('-', '/')) 
        : new Date(new Date(today).getFullYear(), new Date(today).getMonth() + 1, 0);
        
    const startDate = params.startDate
        ? new Date(params.startDate.replaceAll('-', '/'))
        : new Date(new Date(today).getFullYear(), new Date(today).getMonth(), 1);

    // Format for query and display
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    const dateRange = `${startDateStr} - ${endDateStr}`;
    
    return { startDate: startDateStr, endDate: endDateStr, dateRange };
}

/**
 * Generates a unique time-based ID
 */
function generateTimeId() {
    return new Date().toISOString()
        .replaceAll(' ', '')
        .replaceAll(':', '')
        .replaceAll('-', '')
        .replaceAll('.', '');
}

/**
 * Query database for attendance records
 */
async function fetchAttendanceRecords(startDate: string, endDate: string, log: any) {
    return await async(
        db.selectFrom('asistencias')
        .innerJoin('empleados', 'empleados.cedula', 'asistencias.empleado')
          .innerJoin('departamentos', 'departamentos.id_departamento', 'empleados.departamento')
        .selectAll()
          .where('asistencias.fecha', '>=', startDate)
          .where('asistencias.fecha', '<=', endDate)
          .orderBy('asistencias.fecha desc')
          .execute(),
        log
    );
}

/**
 * Process attendance records into department-based structure
 */
function processAttendanceRecords(records: any[], dateRange: string): AsistenciaDepartamento[] {
    if (!records || records.length === 0) {
        return [];
    }
    
    // First, group by department and day of week
    const departmentMap = groupByDepartmentAndDay(records);
    
    // Then convert to the final data structure
    return createFinalStructure(departmentMap, dateRange);
}

/**
 * Group records by department and day of week
 */
function groupByDepartmentAndDay(records: any[]) {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const departmentMap = new Map();
    
    for (const record of records) {
        // Get key data from record
        const departmentName = record.nombre_departamento;
        const dateStr = record.fecha;
        const date = new Date(dateStr);
        const dayOfWeek = weekdays[date.getDay()];
        
        // Create map entries if needed
        if (!departmentMap.has(departmentName)) {
            departmentMap.set(departmentName, new Map());
        }
        
        const dayMap = departmentMap.get(departmentName);
        if (!dayMap.has(dayOfWeek)) {
            dayMap.set(dayOfWeek, { 
                empleados: [], 
                fechas: [], 
                fechaOriginal: dateStr 
            });
        }
        
        // Add employee data
        const dayData = dayMap.get(dayOfWeek);
        dayData.empleados.push({
            nombre: `${record.primer_nombre} ${record.primer_apellido}`,
            cedula: record.cedula,
            hora_entrada: record.hora_entrada,
            hora_salida: record.hora_salida || ""
        });
        
        // Store date info
        dayData.fechas.push(date);
        dayData.fechaOriginal = dateStr; // Keep the most recent
    }
    
    return departmentMap;
}

/**
 * Convert the grouped data into the final structure
 */
function createFinalStructure(departmentMap: Map<string, any>, dateRange: string): AsistenciaDepartamento[] {
    const result: AsistenciaDepartamento[] = [];
    const orderedDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    for (const [departmentName, dayMap] of departmentMap.entries()) {
        const departmentDays: AsistenciaDia[] = [];
        
        // Process each day in standard order
        for (const dayName of orderedDays) {
            if (dayMap.has(dayName)) {
                const dayData = dayMap.get(dayName);
                
                // Sort dates to get earliest
                const sortedDates = [...dayData.fechas].sort((a, b) => a.getTime() - b.getTime());
                
                // Create the attendance day object
                const attendanceDay: AsistenciaDia = {
                    fecha: sortedDates[0],
                    dia: dayName,
                    empleados: dayData.empleados
                };
                
                // Add original date string as extra property
                (attendanceDay as any).fechaOriginal = dayData.fechaOriginal;
                
                departmentDays.push(attendanceDay);
            }
        }
        
        result.push({
            departamento: departmentName,
            lapso: dateRange,
            asistencias: departmentDays
        });
    }
    
    return result;
}
