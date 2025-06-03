<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import Alert from "$lib/components/Messages/Alert.svelte";
    import Calendar from './Calendar.svelte';
    import FullMonthTable from './FullMonthTable.svelte';
    import { goto } from '$app/navigation';
    import { downloadFile } from '$lib/utils/downloadFile';

    // Get data from props
    let { data, form } = $props<{ data: PageData, form: ActionData & { documentId: string } }>();

    $effect(() => {
        if (form && form.success && form.form === "printAsistencias") {
            downloadFile(`/downloads/${form.documentId}?type=asistencias`, `asistencia_${form.documentId}.pdf`)
        }
    })

    let { 
        empleados, filteredEmpleados, asistencias, 
        departamentos, tiposAsistencia, dateRange, dateRangeDays 
    } = $derived(data);

    // Calendar date range state
    let dateRangeStart = $state<Date>(new Date(dateRange?.startDate || Date.now()));
    let dateRangeEnd = $state<Date>(new Date(dateRange?.endDate || Date.now()));
    
    // Filter state synced with URL params
    let searchTerm = $state<string>("");
    let selectedDepartamento = $state<string>("all");
    
    // Current month/year for backward compatibility
    let currentMonth = $state<number>(dateRangeStart.getMonth());
    let currentYear = $state<number>(dateRangeStart.getFullYear());
    
    // Update month/year when date range changes
    $effect(() => {
        currentMonth = dateRangeStart.getMonth();
        currentYear = dateRangeStart.getFullYear();
    });
    
    // Update URL with all filter parameters
    function updateURL(): void {
        let start = dateRangeStart;
        let end = dateRangeEnd;
        const params = new URLSearchParams();

        params.set('startDate', start.toISOString().split('T')[0]);
        params.set('endDate', end.toISOString().split('T')[0]);
        
        if (searchTerm) params.set('search', searchTerm);
        if (selectedDepartamento !== 'all') params.set('departamento', selectedDepartamento);
        
        goto(`?${params.toString()}`, { keepFocus: true, replaceState: true });
    }
    
    // Handle date range selection from calendar
    function handleDateRangeSelected(event: { detail: { startDate: Date, endDate: Date } }): void {
        const { startDate, endDate } = event.detail;
        dateRangeStart = startDate;
        dateRangeEnd = endDate;
        updateURL(startDate, endDate);
    }
    
    // Reset all filters
    function resetFilters(): void {
        searchTerm = "";
        selectedDepartamento = "all";
        
        // Set date range to current month
        const today = new Date();
        dateRangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateRangeEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        updateURL(dateRangeStart, dateRangeEnd);
    }

    function setDate(type: 'start' | 'end') {
        let input = document.getElementById(`input_${type}`) as HTMLInputElement
        switch (type) {
            case "start":
                dateRangeStart = new Date(input.value)
                updateURL()
                break
            case "end":
                dateRangeEnd = new Date(input.value)
                updateURL()
                break
        }
    }

    function formatDate(dateString: Date) {
        const utcDate = new Date(dateString.toISOString().split('T')[0] + 'T00:00:00Z');

        const year = utcDate.getUTCFullYear();
        const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(utcDate.getUTCDate()).padStart(2, '0');

        const formattedDate = `${day}/${month}/${year}`; // For 'dd/mm/yyyy' like '10/05/2025'
        // Or for 'yyyy-mm-dd'
        // const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate); // Output: 10/05/2025
        return formattedDate
    }
</script>

<div class="size-full relative">
    <Alert form={null} styles="absolute top-4 left-4 max-w-sm"/>
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold"><i class="fa-solid fa-clipboard-list"></i> Administrar Asistencias</h1>
            <a href="/asistencias/registrar" class="btn btn-sm btn-primary">
                <i class="fa-solid fa-plus"></i> Registrar
            </a>
        </div>

    <div class="w-full flex items-end justify-between my-4">
        <!-- Stats section -->
        <div class="stats bg-base-200 text-base-content shadow border border-base-content/20">
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

        <!-- Selected date range display -->
        <div class="text-sm w-full max-w-sm">
            <p class="font-semibold">Rango seleccionado:</p>
            <p class="text-primary">
                {formatDate(dateRangeStart)} - {formatDate(dateRangeEnd)}
            </p>

            <div class="w-full border border-base-content/30 p-2 rounded-md mt-2 flex items-center justify-between">
                <!-- <input type="date" class="input input-bordered input-sm" on:input={() => setDate('start')}  id="input_start" value={`${dateRangeStart.getFullYear()}-${(dateRangeStart.getMonth()+1) <= 9 ? `0${dateRangeStart.getMonth()+1}` : dateRangeStart.getMonth()+1}-${(dateRangeStart.getDate()) <= 9 ? `0${dateRangeStart.getDate()}` : dateRangeStart.getDate()}`}>
                <input type="date" class="input input-bordered input-sm" on:input={() => setDate('end')}   id="input_end"    value={`${dateRangeEnd.getFullYear()}-${(dateRangeEnd.getMonth()+1) <= 9 ? `0${dateRangeEnd.getMonth()+1}` : dateRangeEnd.getMonth()+1}-${(dateRangeEnd.getDate()) <= 9 ? `0${dateRangeEnd.getDate()}` : dateRangeEnd.getDate()}`}> -->
                <input type="date" class="input input-bordered input-sm" on:input={() => setDate('start')}  id="input_start" value={`${dateRangeStart.toISOString().split('T')[0]}`}>
                <input type="date" class="input input-bordered input-sm" on:input={() => setDate('end')}   id="input_end"    value={`${dateRangeEnd.toISOString().split('T')[0]}`}>
            </div>
        </div>
    </div>

    <div class="w-full p-3 bg-base-100 rounded-md shadow-md border border-base-content/40 animate-pop mb-4">        
        <!-- Filters and Calendar section -->
        <div class="flex items-start justify-between gap-6 mb-4">
            <!-- Filters panel -->
            <div class="w-2/5 bg-base-200/40 flex flex-col flex-wrap items-start gap-4 
                border border-base-content/20 p-3 rounded-md shadow-md">
                <div class="w-full max-h-[20rem] flex flex-col flex-wrap items-start gap-4">
                    <h3 class="text-xl">Filtros</h3>

                    <!-- Search filter -->
                    <div class="form-control w-[17rem]">
                        <label class="label">
                            <span class="label-text font-semibold"><i class="fa-solid fa-search mr-1"></i>Buscar</span>
                        </label>
                        <input type="text" placeholder="Nombre o cédula..." 
                            class="input input-bordered input-sm w-full" 
                            bind:value={searchTerm}
                            on:input={updateURL}/>
                    </div>

                    <!-- Department filter -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold"><i class="fa-solid fa-building mr-1"></i>Departamento</span>
                        </label>
                        <select class="select select-bordered select-sm w-[180px]" 
                            bind:value={selectedDepartamento}
                            on:change={updateURL}>
                            <option value='all'>Todos</option>
                            {#each departamentos || [] as dept}
                                <option value={dept.id}>{dept.nombre}</option>
                            {/each}
                        </select>
                    </div>
                    
                    <!-- Reset filters button -->
                    <button class="btn btn-sm btn-outline" on:click={resetFilters}>
                        <i class="fa-solid fa-filter-circle-xmark mr-1"></i>Limpiar Filtros
                    </button>
                </div>
            </div>

            <!-- Calendar component -->
            <div class="w-3/5">
                <Calendar 
                    bind:startDate={dateRangeStart}
                    bind:endDate={dateRangeEnd}
                    onDateRangeSelected={handleDateRangeSelected}
                />
            </div>
        </div>
    </div>

    <!-- Attendance Table -->
    <FullMonthTable  
        startDate={dateRangeStart}
        endDate={dateRangeEnd}
        employees={filteredEmpleados}
        asistencias={asistencias}
        attendanceTypes={tiposAsistencia}
        dateRangeDays={dateRangeDays}
    />
</div>

<style lang="postcss">
    .label { @apply p-0 pb-1; }
</style>
