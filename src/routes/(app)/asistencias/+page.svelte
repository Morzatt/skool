<script lang="ts">
    import type { PageData } from './$types';
    import Alert from "$lib/components/Messages/Alert.svelte";
    import { onMount } from 'svelte';
    import Calendar from './Calendar.svelte';
    import FullMonthTable from './FullMonthTable.svelte';

    let { data }: { data: PageData } = $props();
    let { empleados, asistencias } = $derived(data);

    // Calendar and date range state
    let dateRangeStart = $state(new Date());
    let dateRangeEnd = $state(new Date());
    
    // Handle date range selection
    function handleDateRangeSelected(event: any) {
        const { startDate, endDate } = event.detail;
        dateRangeStart = startDate;
        dateRangeEnd = endDate;
        
        // Here you would typically filter your data based on the date range
        // For now, we'll just log the date range
        console.log('Date range selected:', { startDate, endDate });
    }
    
    // Filter and search
    let searchTerm = $state("");

    let currentMonth = $state(new Date().getMonth());
    let currentYear = $state(new Date().getFullYear());

    let selectedDepartamento = $state("all");
    let selectedTurno = $state("all");
    
    // Available shifts
    const turnos = ["all", "Mañana", "Tarde"];
    
    // Get days in month
    $effect(() => {
        daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        generateDaysArray();
    });
    
    let daysInMonth = $state(new Date(currentYear, currentMonth + 1, 0).getDate());
    let daysArray = $state<string[]>([]);
    
    function generateDaysArray() {
        const tempArray = [];
        for (let i = 1; i <= daysInMonth; i++) {
            tempArray.push(i.toString().padStart(2, '0'));
        }
        daysArray = tempArray;
    }
    
    // Reset all filters
    function resetFilters() {
        searchTerm = "";
        selectedDepartamento = "all";
        selectedTurno = "all";
    }
    
    onMount(() => {
        generateDaysArray();
        // Set default date range to last 7 days
        const today = new Date();
        dateRangeEnd = today;
        dateRangeStart = new Date();
        dateRangeStart.setDate(today.getDate() - 6);
    });
</script>

<div class="size-full relative">
    <Alert form={null} styles="absolute top-4 left-4 max-w-sm"/>

    <div class="w-full p-4 bg-base-100 rounded-md shadow-md border border-base-content/40 animate-pop mb-4">
        <div class="w-full flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold"><i class="fa-solid fa-clipboard-list"></i> Administrar Asistencias</h1>
            <div class="flex items-center gap-3">
                <a href="/asistencias/registrar" class="btn btn-sm btn-primary">
                    <i class="fa-solid fa-plus"></i> Registrar
                </a>
            </div>
        </div>
        
        <!-- Filters Section -->
        <div class="w-full p-3 bg-base-300 rounded-md mb-4 animate-pop-delayed" style="--delay: 50ms">
            <div class="flex flex-wrap items-end gap-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold"><i class="fa-solid fa-search mr-1"></i>Buscar</span>
                    </label>

                    <div class="input-group">
                        <input type="text" placeholder="Nombre o cédula..." 
                               class="input input-bordered input-sm w-[180px]" 
                               bind:value={searchTerm}/>
                    </div>
                </div>
                
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold"><i class="fa-solid fa-building mr-1"></i>Departamento</span>
                    </label>
                    <select class="select select-bordered select-sm w-[180px]" bind:value={selectedDepartamento}>
                        <option value='all'>Todos</option>
                        {#if data.departamentos}
                            {#each data.departamentos as dept}
                                <option value={dept.id_departamento}>{dept.nombre_departamento}</option>
                            {/each}                           
                        {/if}
                    </select>
                </div>
                
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold"><i class="fa-solid fa-clock mr-1"></i>Turno</span>
                    </label>
                    <select class="select select-bordered select-sm w-[180px]" bind:value={selectedTurno}>
                        {#each turnos as turno}
                            <option value={turno}>{turno === "all" ? "Todos" : turno}</option>
                        {/each}
                    </select>
                </div>
                
                <button class="btn btn-sm btn-outline" onclick={resetFilters}>
                    <i class="fa-solid fa-filter-circle-xmark mr-1"></i>Limpiar Filtros
                </button>
                
                <div class="flex-grow"></div>
                
                <button class="btn btn-sm btn-outline" title="Exportar Registros">
                    <i class="fa-solid fa-file-export mr-1"></i>Exportar
                </button>
            </div>
        </div>
        
        <div class="w-full flex items-center justify-between gap-6 mb-4">
            <div class="stats shadow w-2/5">
                <div class="stat">
                    <div class="stat-title">Total Empleados</div>
                    <div class="stat-value">{data.empleados?.length || 0}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Asistencias Hoy</div>
                    <div class="stat-value text-success">{data.asistenciasHoy || 0}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Ausencias Hoy</div>
                    <div class="stat-value text-error">{(data.empleados?.length || 0) - (data.asistenciasHoy || 0)}</div>
                </div>
            </div>
        

            <div class="flex items-center gap-1 w-3/5">
                <!-- Calendar component -->
                <Calendar 
                    bind:startDate={dateRangeStart}
                    bind:endDate={dateRangeEnd}
                    on:dateRangeSelected={handleDateRangeSelected}
                />
            </div>
        </div>
    </div>

    <FullMonthTable  
        daysArray={daysArray}
        filteredEmployees={empleados}
        currentYear={currentYear}
        currentMonth={currentMonth}
        asistencias={asistencias}
    />
</div>

<style lang="postcss">
    .stats {
        @apply bg-base-200 text-base-content;
    }
    .label {
        @apply p-0 pb-1;
    }
</style>
