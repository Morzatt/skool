<script lang="ts">
    import { formatStringWithDots } from "$lib";

    let { daysArray, filteredEmployees, currentYear, currentMonth, asistencias } = $props()

    // Get attendance status for employee on specific day
    function getAttendanceStatus(empleadoId: string, day: string) {
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day}`;
        
        const attendance = asistencias?.find(a => 
            a.empleado === empleadoId && 
            new Date(a.fecha).toISOString().split('T')[0] === dateStr
        );
        
        if (!attendance) return { status: 'Ausente', color: 'error', value: 'fa-solid fa-circle-xmark' };
        
        if (attendance.hora_entrada && attendance.hora_salida) {
            return { status: 'Asistido', color: 'success', value: 'fa-solid fa-circle-check' };
        } else if (attendance.hora_entrada) {
            return { status: 'Incompleta', color: 'warning', value: 'fa-solid fa-spinner' };
        }
        
        return { status: 'absent', color: 'error', value: '0%' };
    }
</script>

<div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh)] animate-pop-delayed border border-base-content/40" style="--delay: 200ms">
    <table class="table table-zebra">
        <thead class="sticky top-0 z-50">
            <tr>
                <th class="sticky top-0 left-0 z-40 min-w-[200px]">Empleado</th>
                {#each daysArray as day}
                    <th class="text-center min-w-[50px]">
                        <span>{day}</span>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#if filteredEmployees.length === 0}
                <tr>
                    <td colspan={daysArray.length + 1} class="text-center py-8">
                        <div class="flex flex-col items-center justify-center">
                            <i class="fa-solid fa-filter-circle-xmark text-4xl text-base-content/40 mb-2"></i>
                            <p class="text-base-content/60">No se encontraron empleados con los filtros seleccionados</p>
                            <!-- <button class="btn btn-sm btn-ghost mt-2" onclick={resetFilters}>
                                Limpiar filtros
                            </button> -->
                        </div>
                    </td>
                </tr>
            {:else}
                {#each filteredEmployees as empleado (empleado.cedula)}
                    <tr>
                        <td class="sticky left-0 bg-base-100 z-20 border border-base-content/40">
                            <div class="flex items-center space-x-3">
                                <div class="avatar placeholder">
                                    <div class="bg-base-300 text-base-content rounded-full w-10">
                                        <span>{empleado.primer_nombre[0]}{empleado.primer_apellido[0]}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold">{empleado.primer_nombre} {empleado.primer_apellido}</div>
                                    <div class="text-sm opacity-70">
                                        {empleado.nacionalidad == "Venezolano" ? "V-" : "E-"}{formatStringWithDots(empleado.cedula)}
                                    </div>
                                    <div class="text-xs opacity-50">{empleado.nombre_departamento}</div>
                                </div>
                            </div>
                        </td>
                        {#each daysArray as day}
                            {@const status = getAttendanceStatus(empleado.cedula, day)}
                            <td class="text-center p-1 z-10 py-0 border border-base-content/40">
                                <div class="tooltip" data-tip={status.status}>
                                    <div class="size-10 gap-1 flex flex-col items-center justify-center">
                                        <i class="{status.value} text-4xl text-{status.color}"></i>
                                    </div>
                                </div>
                            </td>
                        {/each}
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>    

<style lang="postcss">
    .table {
        @apply w-full;
    }
    .table th {
        @apply bg-base-content text-base-100;
    }
</style> 