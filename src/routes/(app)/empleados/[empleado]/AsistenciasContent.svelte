<script lang="ts">
    import { enhance } from "$app/forms";
    import { formatStringWithDots } from "$lib";
    
    // Extend props to include asistencias data
    let { empleado, asistencias = [] }: {
        empleado: any, 
        asistencias?: Array<{
            id_asistencia: string;
            empleado: string;
            fecha: string;
            hora_entrada?: string;
            hora_salida?: string;
            encargado: string;
        }>
    } = $props();
    
    // Calculate attendance statistics from actual data
    let totalAsistencias = $derived(asistencias.length);
    let totalHorasTrabajas = $derived(asistencias.reduce((total, record) => {
        if (!record.hora_entrada || !record.hora_salida) return total;
        
        try {
            const entryTime = new Date(`2000-01-01T${record.hora_entrada}`);
            const exitTime = new Date(`2000-01-01T${record.hora_salida}`);
            const hours = (exitTime.getTime() - entryTime.getTime()) / 3600000; // Convert ms to hours
            return total + (hours > 0 ? hours : 0);
        } catch (e) {
            return total;
        }
    }, 0));
    
    let promedioHoras = $derived(totalAsistencias > 0 ? totalHorasTrabajas / totalAsistencias : 0);
    let diaMasLargo = $derived(asistencias.reduce((max, record) => {
        if (!record.hora_entrada || !record.hora_salida) return max;
        
        try {
            const entryTime = new Date(`2000-01-01T${record.hora_entrada}`);
            const exitTime = new Date(`2000-01-01T${record.hora_salida}`);
            const hours = (exitTime.getTime() - entryTime.getTime()) / 3600000;
            return Math.max(max, hours);
        } catch (e) {
            return max;
        }
    }, 0));
    
    // Create attendance stats object
    let attendanceStats = $derived({
        totalDays: totalAsistencias,
        totalHours: Math.round(totalHorasTrabajas),
        longestDay: diaMasLargo.toFixed(2),
        averageHours: promedioHoras.toFixed(2)
    });
    
    // Generate month names
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    
    // Current date information
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create calendar days array
    function generateCalendarData() {
        const calendarDays = [];
        
        // First day of month (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        // Add empty cells for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push({ day: "", status: "empty" });
        }
        
        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // Find attendance record for this day
            const record = asistencias.find(a => {
                const recordDate = new Date(a.fecha);
                return recordDate.getDate() === i && 
                       recordDate.getMonth() === currentMonth && 
                       recordDate.getFullYear() === currentYear;
            });
            
            let status = 'absent';
            if (isWeekend) {
                status = 'weekend';
            } else if (record) {
                if (record.hora_entrada && record.hora_salida) {
                    const entryHour = parseInt(record.hora_entrada.split(':')[0]);
                    status = entryHour >= 9 ? 'late' : 'present';
                } else if (record.hora_entrada) {
                    status = 'halfday';
                }
            }
            
            calendarDays.push({
                day: i,
                status,
                record
            });
        }
        
        return calendarDays;
    }
    
    let calendarDays = $derived(generateCalendarData());
    
    // Generate calendar grid with 7 columns (1 week)
    function getCalendarGrid(days) {
        const grid = [];
        let week = [];
        
        for (const day of days) {
            week.push(day);
            
            if (week.length === 7) {
                grid.push([...week]);
                week = [];
            }
        }
        
        // Add remaining days if needed
        if (week.length > 0) {
            while (week.length < 7) {
                week.push({ day: "", status: "empty" });
            }
            grid.push(week);
        }
        
        return grid;
    }
    
    let calendarGrid = $derived(getCalendarGrid(calendarDays));
    
    // Group attendance by month
    let attendanceByMonth = $derived(asistencias.reduce((acc, record) => {
        const date = new Date(record.fecha);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        if (!acc[month]) {
            acc[month] = [];
        }
        
        acc[month].push(record);
        return acc;
    }, {}));
    
    // Format time from database (HH:MM:SS) to display format (HH:MM AM/PM)
    function formatTime(timeString) {
        if (!timeString) return 'No registrado';
        
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            
            return date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } catch (e) {
            return timeString;
        }
    }
    
    // Calculate hours worked between entry and exit
    function calculateHoursWorked(record) {
        if (!record.hora_entrada || !record.hora_salida) return 0;
        
        try {
            const [entryHours, entryMinutes] = record.hora_entrada.split(':').map(Number);
            const [exitHours, exitMinutes] = record.hora_salida.split(':').map(Number);
            
            let hours = exitHours - entryHours;
            let minutes = exitMinutes - entryMinutes;
            
            if (minutes < 0) {
                hours--;
                minutes += 60;
            }
            
            return hours + (minutes / 60);
        } catch (e) {
            return 0;
        }
    }
    
    // Get the most recent attendance records
    let recentAttendance = $derived([...asistencias]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 10));
    
    // Determine attendance status based on record
    function getAttendanceStatus(record) {
        if (!record) return { code: 'AUS', class: 'badge-error', label: 'Ausente' };
        
        if (record.hora_entrada && record.hora_salida) {
            const entryHour = parseInt(record.hora_entrada.split(':')[0]);
            if (entryHour >= 9) {
                return { code: 'TAR', class: 'badge-warning', label: 'Tardanza' };
            }
            return { code: 'PRE', class: 'badge-success', label: 'Presente' };
        } else if (record.hora_entrada) {
            return { code: 'MED', class: 'badge-info', label: 'Medio Día' };
        }
        
        return { code: 'AUS', class: 'badge-error', label: 'Ausente' };
    }
</script>

<div class="w-full animate-pop-delayed">
    <!-- Profile and Stats Section -->
    <div class="w-full flex flex-col sm:flex-row gap-5 items-start mb-6">
        <!-- Profile Card -->
        <div class="bg-base-200 rounded-lg shadow-md p-4 flex items-center gap-4 w-full sm:w-auto border border-base-content/10">
            <div class="avatar">
                <i class="fa-solid fa-face-smile text-6xl"></i>
            </div>
            <div>
                <h3 class="font-bold">{empleado.primer_nombre} {empleado.primer_apellido}</h3>
                <p class="text-sm text-base-content/70">{empleado.cargo || 'Sin cargo'}</p>
                <p class="text-xs text-base-content/50">{empleado.nacionalidad === "Venezolano" ? "V" : "E"}-{formatStringWithDots(empleado.cedula)}</p>
            </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-content/10 w-full">
            <div class="stat">
                <div class="stat-title">Total Días</div>
                <div class="stat-value text-primary">{attendanceStats.totalDays}</div>
                <div class="stat-desc">Días Registrados</div>
            </div>
            
            <div class="stat">
                <div class="stat-title">Total Horas</div>
                <div class="stat-value">{attendanceStats.totalHours}</div>
                <div class="stat-desc">Horas Acumuladas</div>
            </div>
            
            <div class="stat">
                <div class="stat-title">Día Más Largo</div>
                <div class="stat-value text-secondary">{attendanceStats.longestDay}</div>
                <div class="stat-desc">Horas</div>
            </div>
            
            <div class="stat">
                <div class="stat-title">Promedio Diario</div>
                <div class="stat-value">{attendanceStats.averageHours}</div>
                <div class="stat-desc">Horas por Día</div>
            </div>
        </div>
    </div>
    
    <!-- Attendance Calendar Section -->
    <div class="w-full border border-base-content/10 rounded-lg p-4 bg-base-100 shadow-md mb-6">
        <h3 class="font-bold text-lg mb-4"><i class="fa-solid fa-calendar-days"></i> Asistencia de {months[currentMonth]} {currentYear}</h3>
        
        <div class="grid grid-cols-7 gap-1 mb-4">
            <div class="text-center font-medium text-sm text-base-content/70">Dom</div>
            <div class="text-center font-medium text-sm text-base-content/70">Lun</div>
            <div class="text-center font-medium text-sm text-base-content/70">Mar</div>
            <div class="text-center font-medium text-sm text-base-content/70">Mié</div>
            <div class="text-center font-medium text-sm text-base-content/70">Jue</div>
            <div class="text-center font-medium text-sm text-base-content/70">Vie</div>
            <div class="text-center font-medium text-sm text-base-content/70">Sáb</div>
        </div>
        
        {#each calendarGrid as week}
            <div class="grid grid-cols-7 gap-1 mb-1">
                {#each week as day}
                    <div class="aspect-square flex items-center justify-center rounded-lg text-sm relative
                        {day.status === 'empty' ? 'bg-transparent' :
                        day.status === 'present' ? 'bg-success/20 text-success-content' :
                        day.status === 'absent' ? 'bg-error/20 text-error-content' :
                        day.status === 'late' ? 'bg-warning/20 text-warning-content' :
                        day.status === 'halfday' ? 'bg-info/20 text-info-content' :
                        'bg-base-200/50 text-base-content/50'}">
                        {day.day}
                        {#if day.record}
                            <div class="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-primary"></div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
        
        <!-- Calendar Legend -->
        <div class="flex flex-wrap gap-3 mt-4">
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-success/50"></div>
                <span class="text-xs">Presente</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-error/50"></div>
                <span class="text-xs">Ausente</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-warning/50"></div>
                <span class="text-xs">Tardanza</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-info/50"></div>
                <span class="text-xs">Medio Día</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-base-200"></div>
                <span class="text-xs">Fin de Semana</span>
            </div>
        </div>
    </div>
    
    <!-- Monthly Grid View for All Months -->
    <div class="w-full border border-base-content/10 rounded-lg p-4 bg-base-100 shadow-md mb-6">
        <h3 class="font-bold text-lg mb-4"><i class="fa-solid fa-calendar-week"></i> Vista Anual de Asistencia</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each months as month, index}
                <div class="p-3 border border-base-content/10 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-200 cursor-pointer">
                    <h4 class="font-medium mb-2">{month}</h4>
                    <div class="grid grid-cols-7 gap-[2px]">
                        {#each Array(21) as _, i}
                            {@const day = i + 1}
                            {@const date = new Date(currentYear, index, day)}
                            {@const hasRecord = asistencias.some(a => {
                                const aDate = new Date(a.fecha);
                                return aDate.getDate() === day && 
                                       aDate.getMonth() === index && 
                                       aDate.getFullYear() === currentYear;
                            })}
                            {@const isValidDay = day <= new Date(currentYear, index + 1, 0).getDate()}
                            {@const isPastDate = date <= new Date()}
                            
                            <div class="aspect-square w-full rounded-sm
                                {!isValidDay ? 'bg-transparent' :
                                hasRecord ? 'bg-success/30' : 
                                !isPastDate ? 'bg-base-300/50' :
                                'bg-error/30'}">
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <!-- Recent Attendance Records -->
    <div class="w-full border border-base-content/10 rounded-lg p-4 bg-base-100 shadow-md">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg"><i class="fa-solid fa-clock-rotate-left"></i> Registro de Asistencias Recientes</h3>
            
            <div class="flex gap-2">
                <button class="btn btn-sm btn-outline">
                    <i class="fa-solid fa-file-export"></i> Exportar
                </button>
                <button class="btn btn-sm btn-outline">
                    <i class="fa-solid fa-print"></i> Imprimir
                </button>
            </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="table table-zebra table-sm">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora Entrada</th>
                        <th>Hora Salida</th>
                        <th>Horas Trabajadas</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {#if recentAttendance.length === 0}
                        <tr>
                            <td colspan="5" class="text-center py-4">
                                <div class="flex flex-col items-center justify-center">
                                    <i class="fa-solid fa-calendar-xmark text-3xl text-base-content/30 mb-2"></i>
                                    <p class="text-base-content/50">No hay registros de asistencia</p>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each recentAttendance as record}
                            {@const status = getAttendanceStatus(record)}
                            {@const hoursWorked = calculateHoursWorked(record)}
                            <tr>
                                <td>{new Date(record.fecha).toLocaleDateString('es-ES')}</td>
                                <td>{formatTime(record.hora_entrada)}</td>
                                <td>{formatTime(record.hora_salida)}</td>
                                <td>{hoursWorked.toFixed(2)}</td>
                                <td>
                                    <span class="badge {status.class}">
                                        {status.label}
                                    </span>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style lang="postcss">
    .animate-pop-delayed {
        --delay: 100ms;
    }
</style>