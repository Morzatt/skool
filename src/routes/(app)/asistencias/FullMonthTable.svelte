<script lang="ts">
    import { formatStringWithDots } from "$lib";
    
    interface Employee {
        id: string;
        nombres: string;
        apellidos: string;
        cargo?: string;
        turno?: string;
        departamento_id?: string;
        departamento_nombre?: string;
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
    
    // Props
    let { 
        daysArray = $bindable([]), 
        employees = $bindable([]), 
        currentMonth = $bindable(0),
        currentYear = $bindable(2023),
        asistencias = $bindable([]),
        attendanceTypes = $bindable([])
    } = $props<{
        daysArray: string[];
        employees: Employee[];
        currentMonth: number;
        currentYear: number;
        asistencias: Attendance[];
        attendanceTypes: AttendanceType[];
    }>();
    
    // Get month name for display
    function getMonthName(month: number): string {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return monthNames[month];
    }
    
    // Generate weekday labels for each day in the month
    const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    
    function getDayOfWeek(day: string): string {
        const date = new Date(currentYear, currentMonth, parseInt(day));
        return weekdays[date.getDay()];
    }
    
    // Get attendance for a specific employee on a specific day
    function getAttendanceForDay(employeeId: string, day: string): Attendance | undefined {
        const dayNum = parseInt(day);
        return asistencias.find(a => 
            a.empleado_id === employeeId && 
            new Date(a.fecha).getDate() === dayNum &&
            new Date(a.fecha).getMonth() === currentMonth &&
            new Date(a.fecha).getFullYear() === currentYear
        );
    }
    
    // Generate default attendance status
    function getDefaultStatus(day: string): string | null {
        const dayNum = parseInt(day);
        const date = new Date(currentYear, currentMonth, dayNum);
        const dayOfWeek = date.getDay();
        
        // Weekend is typically off day
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return 'LIB';
        }
        
        return null;
    }

    // Determine attendance status code
    function determineAttendanceStatus(attendance: Attendance | undefined): string | null {
        if (!attendance) return null;
        
        // If there's an entry time but no exit time, it's present but not checked out
        if (attendance.hora_entrada && !attendance.hora_salida) {
            return 'PR';
        }
        
        // If there's both entry and exit time, it's a complete attendance
        if (attendance.hora_entrada && attendance.hora_salida) {
            return 'PR';
        }
        
        // Default to absent
        return 'AUS';
    }

    // Get background color based on attendance type
    function getAttendanceColor(attendance: Attendance | undefined): string {
        const status = determineAttendanceStatus(attendance);
        if (!status) return '';
        
        const type = attendanceTypes.find(t => t.codigo === status);
        return type ? type.color : '';
    }

    // Get text color based on background (for contrast)
    function getTextColor(bgColor: string): string {
        // For light backgrounds use dark text, for dark backgrounds use light text
        if (!bgColor) return 'text-base-content';
        
        const colorMap: Record<string, string> = {
            'bg-success': 'text-success-content',
            'bg-error': 'text-error-content',
            'bg-warning': 'text-warning-content',
            'bg-info': 'text-info-content',
            'bg-secondary': 'text-secondary-content',
            'bg-accent': 'text-accent-content',
            'bg-neutral': 'text-neutral-content'
        };
        
        return colorMap[bgColor] || 'text-base-content';
    }

    // Get attendance code for display
    function getAttendanceCode(attendance: Attendance | undefined): string {
        const status = determineAttendanceStatus(attendance);
        if (!status) return '';
        
        return status;
    }

    // Format time for display (HH:MM)
    function formatTime(timeStr: string | undefined): string {
        if (!timeStr) return '';
        
        // Check if it's already in HH:MM format
        if (timeStr.includes(':')) {
            return timeStr.substring(0, 5); // Get only HH:MM part
        }
        
        // Create a date and format the time
        const date = new Date(`2000-01-01T${timeStr}`);
        return date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
    }

    // Check if date is weekend
    function isWeekend(day: string): boolean {
        const dayNum = parseInt(day);
        const date = new Date(currentYear, currentMonth, dayNum);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    }

    // Handle clicking on a cell to view/edit attendance
    function handleCellClick(employee: Employee, day: string): void {
        const attendance = getAttendanceForDay(employee.id, day);
        console.log('Cell clicked:', employee.nombres, day, attendance);
        // Here you would typically dispatch an event or update a store
        // to open a modal for viewing/editing the attendance
    }
</script>

<div class="w-full animate-pop">
    <div class="w-full bg-base-200/40 border border-base-content/20 rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">
                Reporte de asistencia mensual - {getMonthName(currentMonth)} {currentYear}
            </h3>
            
            <div class="flex items-center gap-2">
                <button class="btn btn-sm btn-outline">
                    <i class="fa-solid fa-file-export"></i> Exportar
                </button>
                <button class="btn btn-sm btn-outline">
                    <i class="fa-solid fa-print"></i> Imprimir
                </button>
            </div>
        </div>
        
        <div class="overflow-x-auto rounded-lg">
            <table class="table table-xs w-full bg-base-100">
                <!-- Header with day numbers and weekdays -->
                <thead>
                    <tr>
                        <th class="sticky left-0 z-20 bg-base-200 min-w-40">Nombres y roles</th>
                        
                        {#each daysArray as day}
                            <th class="text-center p-1 min-w-10 text-xs {isWeekend(day) ? 'bg-base-300' : 'bg-base-200'}" 
                                colSpan="1">
                                <div class="flex flex-col items-center">
                                    <span class="font-bold">{day}</span>
                                    <span class="text-xs opacity-70">{getDayOfWeek(day)}</span>
                                </div>
                            </th>
                        {/each}
                    </tr>
                </thead>
                
                <tbody>
                    {#each employees as employee, index}
                        <tr class="{index % 2 === 0 ? 'bg-base-100' : 'bg-base-100/80'}">
                            <!-- Employee info column -->
                            <td class="sticky left-0 z-10 {index % 2 === 0 ? 'bg-base-100' : 'bg-base-100/80'} border-r border-base-300">
                                <div class="flex flex-col gap-1">
                                    <span class="font-medium">{employee.apellidos}, {employee.nombres}</span>
                                    <span class="text-xs text-base-content/70">{employee.cargo || 'N/A'}</span>
                                    <span class="text-xs text-base-content/50">#{employee.id.substring(0, 8)}</span>
                                </div>
                            </td>
                            
                            <!-- Attendance cells for each day -->
                            {#each daysArray as day}
                                {@const attendance = getAttendanceForDay(employee.id, day)}
                                {@const bgColor = getAttendanceColor(attendance) || (isWeekend(day) ? 'bg-neutral/30' : '')}
                                {@const textColor = getTextColor(bgColor)}
                                {@const defaultStatus = getDefaultStatus(day)}
                                {@const statusCode = getAttendanceCode(attendance) || defaultStatus || ''}
                                
                                <td 
                                    class="text-center p-1 h-12 cursor-pointer hover:bg-base-200/70 {bgColor} {textColor}"
                                    on:click={() => handleCellClick(employee, day)}
                                >
                                    <div class="flex flex-col items-center">
                                        <span class="text-xs font-medium">
                                            {statusCode}
                                        </span>
                                        
                                        {#if attendance?.hora_entrada}
                                            <span class="text-[0.65rem] opacity-80">
                                                {formatTime(attendance.hora_entrada)}
                                            </span>
                                        {/if}
                                    </div>
                                </td>
                            {/each}
                        </tr>
                    {/each}
                    {#if employees.length === 0}
                        <tr>
                            <td colspan={daysArray.length + 1} class="text-center py-8">
                                <div class="flex flex-col items-center justify-center">
                                    <i class="fa-solid fa-users-slash text-4xl text-base-content/40 mb-2"></i>
                                    <p class="text-base-content/60">No se encontraron empleados</p>
                                </div>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        
        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-3 mt-4 p-3 bg-base-100 rounded-md border border-base-300">
            {#each attendanceTypes as type}
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded {type.color}"></div>
                    <span class="text-xs">{type.label} ({type.codigo})</span>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    /* Ensure table has clean borders and compact design */
    th, td {
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    /* Make the table more compact */
    td, th {
        padding: 0.35rem !important;
    }
</style> 