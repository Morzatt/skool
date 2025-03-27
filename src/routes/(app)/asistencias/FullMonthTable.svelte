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
    
    // Props
    let { 
        daysArray = $bindable([]), 
        employees = $bindable([]), 
        currentMonth = $bindable(0),
        currentYear = $bindable(2023),
        startDate = $bindable(new Date()),
        endDate = $bindable(new Date()),
        asistencias = $bindable([]),
        attendanceTypes = $bindable([]),
        dateRangeDays = $bindable<DayInfo[]>([])
    } = $props<{
        daysArray: string[];
        employees: Employee[];
        currentMonth: number;
        currentYear: number;
        startDate: Date;
        endDate: Date;
        asistencias: Attendance[];
        attendanceTypes: AttendanceType[];
        dateRangeDays?: DayInfo[];
    }>();
    
    // Use server-provided dateRangeDays if available, otherwise generate locally
    let localDateRangeDays = $state<DayInfo[]>([]);
    
    $effect(() => {
        if (dateRangeDays && dateRangeDays.length > 0) {
            // Use server-provided days array
            localDateRangeDays = dateRangeDays;
        } else if (startDate && endDate) {
            // Generate days array locally if server didn't provide it
            generateDateRangeDays();
        }
    });
    
    function generateDateRangeDays(): void {
        if (!startDate || !endDate) return;
        
        localDateRangeDays = [];
        
        // Clone dates to avoid modifying originals
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Set time to beginning/end of day for accurate comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        // Generate array of days in the date range
        const currentDate = new Date(start);
        const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        
        while (currentDate <= end) {
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            const dayOfWeek = currentDate.getDay();
            
            localDateRangeDays.push({
                day,
                month,
                year,
                weekday: weekdays[dayOfWeek],
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6
            });
            
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    
    // Get month name for display
    function getMonthName(month: number): string {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return monthNames[month];
    }
    
    // Format date range for title
    function formatDateRange(): string {
        if (!startDate || !endDate) return '';
        
        if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
            return `${getMonthName(startDate.getMonth())} ${startDate.getFullYear()}`;
        }
        
        return `${startDate.getDate()} ${getMonthName(startDate.getMonth())} - ${endDate.getDate()} ${getMonthName(endDate.getMonth())} ${endDate.getFullYear()}`;
    }
    
    // Get attendance for a specific employee on a specific day
    function getAttendanceForDay(employeeId: string, day: string, month: number, year: number): Attendance | undefined {
        const dayNum = parseInt(day);
        return asistencias.find(a => {
            const aDate = new Date(a.fecha);
            return a.empleado_id === employeeId && 
                  aDate.getDate() === dayNum &&
                  aDate.getMonth() === month &&
                  aDate.getFullYear() === year;
        });
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

    // Handle clicking on a cell to view/edit attendance
    function handleCellClick(employee: Employee, day: string, month: number, year: number): void {
        const attendance = getAttendanceForDay(employee.id, day, month, year);
        console.log('Cell clicked:', employee.nombres, day, attendance);
        // Here you would typically dispatch an event or update a store
        // to open a modal for viewing/editing the attendance
    }
</script>

<div class="w-full animate-pop">
    <div class="w-full bg-base-200/40 border border-base-content/20 rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">
                Reporte de asistencia - {formatDateRange()}
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
        
        <div class="overflow-x-auto rounded-lg max-h-[calc(100vh-9rem)]">
            <table class="table table-xs w-full bg-base-100">
                <!-- Header with day numbers and weekdays -->
                <thead>
                    <tr>
                        <th class="sticky left-0 z-20 bg-base-200 min-w-40">Nombres y roles</th>
                        
                        {#each localDateRangeDays as dayInfo}
                            <th class="text-center p-1 min-w-10 text-xs {dayInfo.isWeekend ? 'bg-base-300' : 'bg-base-200'}" 
                                colSpan="1">
                                <div class="flex flex-col items-center">
                                    <span class="font-bold">{dayInfo.day}</span>
                                    <span class="text-xs opacity-70">{dayInfo.weekday}</span>
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
                            {#each localDateRangeDays as dayInfo}
                                {@const attendance = getAttendanceForDay(employee.id, dayInfo.day, dayInfo.month, dayInfo.year)}
                                {@const bgColor = attendance?.statusColor || (dayInfo.isWeekend ? 'bg-neutral/30' : '')}
                                {@const textColor = bgColor.includes('bg-') ? bgColor.replace('bg-', 'text-').replace('-content', '') + '-content' : 'text-base-content'}
                                {@const statusCode = attendance?.statusCode || (dayInfo.isWeekend ? 'LIB' : '')}
                                
                                <td 
                                    class="text-center p-1 h-12 cursor-pointer hover:bg-base-200/70 {bgColor} {textColor}"
                                    on:click={() => handleCellClick(employee, dayInfo.day, dayInfo.month, dayInfo.year)}
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
                            <td colspan={localDateRangeDays.length + 1} class="text-center py-8">
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