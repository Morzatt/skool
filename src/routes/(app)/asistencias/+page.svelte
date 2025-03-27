<script lang="ts">
    import type { PageData } from './$types';
    import Alert from "$lib/components/Messages/Alert.svelte";
    import { onMount } from 'svelte';
    import Calendar from './Calendar.svelte';
    import FullMonthTable from './FullMonthTable.svelte';
    import { goto } from '$app/navigation';

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
    
    interface DateRange {
        startDate: Date | string;
        endDate: Date | string;
    }

    let { data }: { data: PageData } = $props();
    let { empleados, asistencias, departamentos, tiposAsistencia, dateRange } = $derived(data);

    // Calendar and date range state - initialize from server data
    let dateRangeStart = $state<Date>(dateRange?.startDate ? new Date(dateRange.startDate) : new Date());
    let dateRangeEnd = $state<Date>(dateRange?.endDate ? new Date(dateRange.endDate) : new Date());
    
    // Handle date range selection
    function handleDateRangeSelected(event: { detail: { startDate: Date, endDate: Date } }): void {
        const { startDate, endDate } = event.detail;
        dateRangeStart = startDate;
        dateRangeEnd = endDate;
        
        // Update URL with new date range
        updateURLWithDateRange(startDate, endDate);
    }
    
    // Update URL with date range parameters
    function updateURLWithDateRange(start: Date, end: Date): void {
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        
        // Use goto to navigate with the new query parameters
        goto(`?startDate=${startStr}&endDate=${endStr}`, { keepFocus: true, replaceState: true });
    }
    
    // Filter and search
    let searchTerm = $state<string>("");
    let selectedDepartamento = $state<string>("all");
    
    let filteredEmpleados = $state<Employee[]>(empleados || []);
    
    // Filter employees based on search and department
    $effect(() => {
        filteredEmpleados = empleados?.filter(emp => {
            // Text search filter
            const matchesSearch = searchTerm === "" || 
                emp.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.id.includes(searchTerm);
            
            // Department filter
            const matchesDepartment = selectedDepartamento === "all" || 
                emp.departamento_id === selectedDepartamento;
            
            return matchesSearch && matchesDepartment;
        }) || [];
    });
    
    // Current month and days array for table
    let currentMonth = $state<number>(new Date().getMonth());
    let currentYear = $state<number>(new Date().getFullYear());
    let daysArray = $state<string[]>([]);
    
    // Update current month/year from date range
    $effect(() => {
        if (dateRangeStart) {
            currentMonth = dateRangeStart.getMonth();
            currentYear = dateRangeStart.getFullYear();
            generateDaysArray();
        }
    });
    
    function generateDaysArray(): void {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const tempArray: string[] = [];
        for (let i = 1; i <= daysInMonth; i++) {
            tempArray.push(i.toString().padStart(2, '0'));
        }
        daysArray = tempArray;
    }
    
    // Reset all filters
    function resetFilters(): void {
        searchTerm = "";
        selectedDepartamento = "all";
        
        // Reset date range to current month
        const today = new Date();
        dateRangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateRangeEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        // Update URL
        updateURLWithDateRange(dateRangeStart, dateRangeEnd);
    }
    
    onMount(() => {
        generateDaysArray();
    });
</script>

<div class="size-full relative">
    <Alert form={null} styles="absolute top-4 left-4 max-w-sm"/>

    <div class="w-full p-3 bg-base-100 rounded-md shadow-md border border-base-content/40 animate-pop mb-4">
        <div class="w-full flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold"><i class="fa-solid fa-clipboard-list"></i> Administrar Asistencias</h1>
            <div class="flex items-center gap-3">
                <a href="/asistencias/registrar" class="btn btn-sm btn-primary">
                    <i class="fa-solid fa-plus"></i> Registrar
                </a>
            </div>
        </div>
        
        <div class="w-full flex items-start justify-between gap-6 mb-4">
            <div class="w-2/5 max-h-[25rem] bg-base-200/40
            flex flex-col flex-wrap items-start justify-start gap-4 
            border border-base-content/20
            p-3 rounded-md shadow-md">
                <h3 class="text-xl">Filtros</h3>

                <div class="form-control w-[17rem]">
                    <label class="label">
                        <span class="label-text font-semibold"><i class="fa-solid fa-search mr-1"></i>Buscar</span>
                    </label>

                    <input type="text" placeholder="Nombre o cédula..." 
                            class="input input-bordered input-sm w-full" 
                            bind:value={searchTerm}/>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold"><i class="fa-solid fa-building mr-1"></i>Departamento</span>
                    </label>
                    <select class="select select-bordered select-sm w-[180px]" bind:value={selectedDepartamento}>
                        <option value='all'>Todos</option>
                        {#if departamentos}
                            {#each departamentos as dept}
                                <option value={dept.id}>{dept.nombre}</option>
                            {/each}                           
                        {/if}
                    </select>
                </div>
                
                <button class="btn btn-sm btn-outline" on:click={resetFilters}>
                    <i class="fa-solid fa-filter-circle-xmark mr-1"></i>Limpiar Filtros
                </button>
                
                <div class="divider">Periodo</div>
                
                <div class="text-sm">
                    <p class="font-semibold">Rango seleccionado:</p>
                    <p class="text-primary">
                        {dateRangeStart.toLocaleDateString('es-ES')} - {dateRangeEnd.toLocaleDateString('es-ES')}
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-1 w-3/5">
                <!-- Calendar component -->
                <Calendar 
                    bind:startDate={dateRangeStart}
                    bind:endDate={dateRangeEnd}
                    onDateRangeSelected={handleDateRangeSelected}
                />
            </div>
        </div>
        <div>
        <div class="bg-base-200 text-base-content stats shadow border border-base-content/20">
            <div class="stat">
                <div class="stat-title">Total Empleados</div>
                <div class="stat-value">{empleados?.length || 0}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Asistencias Hoy</div>
                <div class="stat-value text-success">{data.asistenciasHoy || 0}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Ausencias Hoy</div>
                <div class="stat-value text-error">{(empleados?.length || 0) - (data.asistenciasHoy || 0)}</div>
            </div>
        </div> 
        </div>
    </div>

    <!-- Full Month Attendance Table -->
    <FullMonthTable  
        daysArray={daysArray}
        employees={filteredEmpleados}
        currentYear={currentYear}
        currentMonth={currentMonth}
        asistencias={asistencias}
        attendanceTypes={tiposAsistencia}
    />
</div>

<style lang="postcss">
    .label {
        @apply p-0 pb-1;
    }
</style>
