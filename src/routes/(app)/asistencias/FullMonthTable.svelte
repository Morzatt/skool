<script lang="ts">
    import { formatStringWithDots } from "$lib";
    
    type Attendance = {
        empleado_id: string;
        fecha: string;
        hora_entrada?: string;
        hora_salida?: string;
        encargado?: string;
        statusCode?: string;
        statusColor?: string;
    }
    
    interface DayInfo {
        day: string;
        month: number;
        year: number;
        weekday: string;
        isWeekend: boolean;
    }
    
    // Props definition with defaults
    let { 
        employees = $bindable([]), 
        startDate = $bindable(new Date()),
        endDate = $bindable(new Date()),
        asistencias = $bindable([]),
        attendanceTypes = $bindable([]),
        dateRangeDays = $bindable<DayInfo[]>([]),
    } = $props();
    
    // Month names for display
    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Format date range for title
    const formatDateRange = () => {
        if (!startDate || !endDate) return '';
        
        const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
        
        return sameMonth
            ? `${MONTHS[startDate.getMonth()]} ${startDate.getFullYear()}`
            : `${startDate.getDate()} ${MONTHS[startDate.getMonth()]} - ${endDate.getDate()} ${MONTHS[endDate.getMonth()]} ${endDate.getFullYear()}`;
    };
    
    // Get attendance for a specific day
    const getAttendance = (empId: string, day: DayInfo): Attendance | undefined =>
        asistencias.find(a => {
            const aDate = new Date(a.fecha);
            return (a.empleado_id === empId) && 
                  (aDate.getDate() === parseInt(day.day)) &&
                  (aDate.getMonth() === day.month) &&
                  (aDate.getFullYear() === day.year);
        });
    
    // Format time (HH:MM)
    const formatTime = (time: string|undefined): string => {
        if (!time) return 'No especificado';

        return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-VE', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
        });
    };
</script>

<div class="w-full animate-pop">
    <div class="w-full bg-base-200/40 border border-base-content/20 rounded-lg shadow-md p-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Reporte de asistencia - {formatDateRange()}</h3>
            
            <div class="flex items-center gap-2">
                <button class="btn btn-sm btn-outline">
                    <i class="fa-solid fa-file-export"></i> Exportar
                </button>
                <button class="btn btn-sm btn-outline">
                    <i class="fa-solid fa-print"></i> Imprimir
                </button>
            </div>
        </div>
        
        <!-- Table with scrolling -->
        <div class="overflow-x-auto rounded-lg max-h-[calc(100vh-9rem)] border border-base-content/30">
            <table class="table table-xs table-zebra w-full bg-base-100">
                <!-- Table header with days -->
                <thead>
                    <tr class="sticky left-0 top-0 z-40">
                        <th class="sticky left-0 top-0 z-50 bg-base-200 min-w-40">Nombres y roles</th>
                        {#if dateRangeDays.length === 1}
                            {#each dateRangeDays as day}
                                <th class="text-center min-w-10 text-xs {day.isWeekend ? 'bg-base-300' : 'bg-base-200'}">
                                    <div class="flex flex-col items-center">
                                        <span class="font-bold">{day.day}</span>
                                        <span class="opacity-70">{day.weekday}</span>
                                    </div>
                                </th>
                                <th class="text-center min-w-10 text-xs {day.isWeekend ? 'bg-base-300' : 'bg-base-200'}">
                                    <div class="flex flex-col items-center">
                                        <span class="font-bold">Hora de Entrada</span>
                                        <span class="opacity-70">{day.weekday}</span>
                                    </div>
                                </th>
                                <th class="text-center min-w-10 text-xs {day.isWeekend ? 'bg-base-300' : 'bg-base-200'}">
                                    <div class="flex flex-col items-center">
                                        <span class="font-bold">Hora de Salida</span>
                                        <span class="opacity-70">{day.weekday}</span>
                                    </div>
                                </th>
                            {/each}
                        {:else}
                            {#each dateRangeDays as day}
                                <th class="text-center min-w-10 text-xs {day.isWeekend ? 'bg-base-300' : 'bg-base-200'}">
                                    <div class="flex flex-col items-center">
                                        <span class="font-bold">{day.day}</span>
                                        <span class="opacity-70">{day.weekday}</span>
                                    </div>
                                </th>
                            {/each}
                        {/if}
                    </tr>
                </thead>
                
                <!-- Table body with employees and attendance -->
                <tbody>
                    {#each employees as employee}
                        <tr class="border border-base-content/40">
                            <!-- Employee info -->
                            <td class="sticky left-0 z-20 bg-base-100 border border-base-content/40">
                                <div class="flex flex-col gap-1">
                                    <span class="font-medium">{employee.apellidos}, {employee.nombres}</span>
                                    <span class="text-xs text-base-content/70">{employee.cargo || 'N/A'}</span>
                                    <span class="text-xs text-base-content/50">{employee.nacionalidad === "Venezolano" ? "V" : "E"}-{formatStringWithDots(employee.id)}</span>
                                </div>
                            </td>
                            {#if dateRangeDays.length === 1}
                                <!-- Attendance cells for each day -->
                                {#each dateRangeDays as day}
                                    {@const attendance = getAttendance(employee.id, day)}
                                    {@const bgColor: string = attendance ? attendance.statusColor! : (day.isWeekend ? 'bg-base-300/30' : 'bg-error')}
                                    {@const textColor = bgColor.includes('bg-') 
                                        ? bgColor.replace('bg-', 'text-').replace('-content', '') + '-content' 
                                        : 'text-base-content'}

                                    {#if attendance?.hora_entrada}                                   
                                        <td class="text-center h-12 cursor-pointer hover:bg-base-200/70 {bgColor} {textColor}"
                                            on:click={() => console.log('Clicked:', employee.nombres, day.day, attendance)}>
                                            <div class="flex flex-col items-center">
                                                <span class="text-xs font-medium">
                                                    {attendance?.statusCode || (day.isWeekend ? 'LIB' : '')}
                                                </span>
                                                <span class="text-[0.65rem] opacity-80">
                                                    {formatTime(attendance.hora_entrada)}
                                                </span>
                                            </div>
                                        </td>

                                        <td>{formatTime(attendance.hora_entrada)}</td>
                                        <td>{formatTime(attendance.hora_salida)}</td>
                                    {:else}
                                        <td class="text-center h-12 cursor-pointer hover:bg-base-200/70 {bgColor} {textColor}"
                                            on:click={() => console.log('Clicked:', employee.nombres, day.day, attendance)}>
                                            <div class="flex flex-col items-center">
                                                <span class="text-xs font-medium">
                                                    {attendance?.statusCode || (day.isWeekend ? 'LIB' : '')}
                                                </span>
                                            </div>
                                        </td>
                                        <td>No especificado.</td>
                                        <td>No especificado.</td>
                                    {/if}
                                {/each}
                            {:else}
                                <!-- Attendance cells for each day -->
                                {#each dateRangeDays as day}
                                    {@const attendance = getAttendance(employee.id, day)}
                                    {@const bgColor = attendance?.statusColor || (day.isWeekend ? 'bg-base-300/30' : '')}
                                    <!-- {@const bgColor: string = attendance ? attendance.statusColor! : (day.isWeekend ? 'bg-base-300/30' : 'bg-error')} -->
                                    {@const textColor = bgColor.includes('bg-') 
                                        ? bgColor.replace('bg-', 'text-').replace('-content', '') + '-content' 
                                        : 'text-base-content'}
                                    
                                    <td class="text-center h-12 cursor-pointer hover:bg-base-200/70 {bgColor} {textColor}"
                                        on:click={() => console.log('Clicked:', employee.nombres, day.day, attendance)}>
                                        <div class="flex flex-col items-center">
                                            <span class="text-xs font-medium">
                                                {attendance?.statusCode || (day.isWeekend ? 'LIB' : '')}
                                            </span>
                                            
                                            {#if attendance?.hora_entrada}
                                                <span class="text-[0.65rem] opacity-80">
                                                    {formatTime(attendance.hora_entrada)}
                                                </span>
                                            {/if}
                                        </div>
                                    </td>
                                {/each}
                            {/if}
                        </tr>
                    {/each}
                    
                    <!-- Empty state -->
                    {#if employees.length === 0}
                        <tr>
                            <td colspan={dateRangeDays.length + 1} class="text-center py-8">
                                <i class="fa-solid fa-users-slash text-4xl text-base-content/40 mb-2"></i>
                                <p class="text-base-content/60">No se encontraron empleados</p>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        
        <!-- Legend -->
        <div class="flex flex-wrap gap-3 mt-4 p-3 bg-base-100 rounded-md border border-base-300">
            {#each attendanceTypes as type}
                <div class="flex items-center gap-2">
                    <div class="size-4 rounded {type.color}"></div>
                    <span class="text-xs">{type.label} ({type.codigo})</span>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    th, td {
        @apply border border-base-content/40;
        padding: 0.35rem !important;
    }
</style> 