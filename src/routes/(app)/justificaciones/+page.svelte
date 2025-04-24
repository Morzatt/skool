<script lang="ts">
    import FilterSelect from '../empleados/FilterSelect.svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { basePath, formatStringWithDots } from '$lib';
    import type { EstadosEmpleado } from '$lib/database/types';
    import type { ActionData, PageData } from './$types';
    import no_result from "$lib/images/3e01667b4c12daee9ea2a1cfabe58e2d.png"
    import { enhance } from '$app/forms';
    import { downloadFile } from '$lib/utils/downloadFile';
    import { checkVigencia } from '$lib/utils/vigencia';

    let { data, form }: { data: PageData, form: ActionData & { fileId: string } } = $props();
    let { justificaciones } = $derived(data)

    let index = $state(0)
    let filter = $state("")
    let search = $state("")
    let estado = $state("")
    let turno = $state("")
    let departamento = $state('')

    let cedula: 'asc'|'desc' = $state('desc')
    let nombre: 'asc'|'desc' = $state('desc')
    let apellido: 'asc'|'desc' = $state('desc')
    let fecha: 'asc'|'desc' = $state('desc')

    let url = $derived(`${basePath}/justificaciones?index=${index}&filter=${filter === "Filtro"?"":filter}&search=${search}&estado=${estado}&turno=${turno}&departamento=${departamento}`)//&cOrder=${cedula}&nOrder=${nombre}&aOrder=${apellido}&fOrder=${fecha}`) 

    let indexHandler = {
        incrementIndex: async () => {
            // if (empleados && empleados.length <= 9) return;
            index += 10
            animate = "animate-x"
            handleSearch()
        },

        decrementIndex: async () => {
            // if (index === 0) return;
            index -= 10
            animate = "animate--x"
            handleSearch()
        }
    }

    async function handleSearch() {
        await invalidateAll()
        goto(url, { keepFocus: true, replaceState: true })
    }

    function asignColor(status: EstadosEmpleado): string {
        switch (status) {
            case "Activo": 
                return "text-green-900 bg-success/50"
            case "Inhabilitado":
                return "text-error-content/50 bg-error/50"
            case "Despedido":
                return "text-red-900 bg-error/50"
            default: 
                return "text-yellow-900 bg-warning/50"
        }
    }

    function setIndex(i: number) {
        // if (i >= total || i <= empleados!.length) { return }
        index = i;
        handleSearch()
    }

    function clearAll() {
        index = 0
        filter = ''
        search = ''
        estado = ''
        turno = ''
        departamento = ''

        handleSearch()
    }

    let animate: 'animate-x' | 'animate--x'= $state('animate-x')
    $effect(() => {
        // if (form && form.success && form.form === "printListaEmpleados") {
        //     downloadFile(`/downloads/${form.fileId}?type=listaEmpleados`, `lista_empleados_${form.fileId}.pdf`)
        // }
    })
</script>

<div class="*: w-full min-h-full lg:h-full">
    <div class="w-full h-12
        flex items-center justify-between flex-wrap">
        <div class="text-2xl font-semibold">
            <h3>Justificaciones</h3>
            <h3 class="text-xl font-medium">Todas las Justificaciones</h3>
        </div>

        <div class="w-max flex items-center justify-between gap-3 flex-wrap">
            <div class="join border border-base-content/60">
                <label class="input join-item flex items-center justify-start gap-2 focus:outline-0 outline-0">
                    <i class="fa-solid fa-user-tie"></i>
                    <input bind:value={search} type="search" class="outline-0 focus:outline-0" placeholder="Buscar justificaciones..."
                    oninput="{handleSearch}"/>

                    <kbd class="kbd kbd-sm">ctrl</kbd>
                    <kbd class="kbd kbd-sm">K</kbd>
                </label>
                
                <button class="join-item w-12 btn tooltip tooltip-bottom flex items-center justify-center" 
                aria-label="search" 
                data-tip="Buscar"
                onclick="{handleSearch}">
                    <i class="fa-solid fa-magnifying-glass text-xl"></i>
                </button>
            </div>

            <FilterSelect inputfn={handleSearch} bind:value={filter} name="Filtro" type="dropdown-left" styles="rounded-md" icon="fa-solid fa-filter" options={[
                {
                    name: "Cédula del Empleado",
                    value: "empleado"
                },
                {
                    name: "Nombre del Empleado",
                    value: "nombre_empleado"
                },
                {
                    name: "Apellido del Empleado",
                    value: "apellido_empleado"
                }
            ]}/>
        </div>
    </div>

    <div class="w-full min-h-[30rem] mt-10 pb-12">
        {#if justificaciones && justificaciones.length > 0}
            <!-- Filtros y vista -->
            <div class="w-full flex flex-wrap items-center justify-between mb-4">
                <div class="flex items-center gap-2 *:bg-base-content *:text-accent">
                    <button class="btn btn-sm" aria-label="all">
                        <i class="fa-solid fa-globe"></i>
                        <span>Todas</span>
                    </button>
                    <button class="btn btn-sm btn-ghost" aria-label="vigente">
                        <i class="fa-solid fa-stopwatch"></i>
                        <span>Vigentes</span>
                    </button>
                    <button class="btn btn-sm btn-ghost" aria-label="pendiente">
                        <i class="fa-solid fa-clock"></i>
                        <span>Pendientes</span>
                    </button>
                    <button class="btn btn-sm btn-ghost" aria-label="expirado">
                        <i class="fa-solid fa-calendar-xmark"></i>
                        <span>Expiradas</span>
                    </button>
                </div>
                
                <div class="flex items-center gap-2">
                    <span class="text-sm">Recientes</span>
                    <i class="fa-solid fa-angle-down"></i>
                    
                    <div class="flex border border-base-300 rounded-md overflow-hidden ml-4">
                        <button class="btn btn-sm btn-ghost btn-square">
                            <i class="fa-solid fa-table-cells"></i>
                        </button>
                        <button class="btn btn-sm bg-base-200 btn-square">
                            <i class="fa-solid fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="w-full h-max rounded-md px-4 flex items-end justify-between flex-wrap">
                <div class="form-control ">
                    <div class="label">
                        <b class="label-text">Imprimir Lista</b>
                    </div>

                    <form method="post" action='?/printListaEmpleados' use:enhance>
                        <button class="btn btn-sm bg-base-content text-base-100 px-6 rounded-xl" aria-label="print-list">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </form>
                </div>

                <div class="form-control">
                    <div class="label justify-end px-4">
                        <!-- <b class="label-text">Pág. {index/10 === 0 ? 1 : index/10} de {Math.round(total/10)}</b> -->
                    </div>
                    <div class="join *:btn-sm *:border *:border-base-content">
                        <button onclick={indexHandler.decrementIndex} class="join-item btn rounded-md" aria-label="decrement-index">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>

                        <button onclick={() => { setIndex(1) }} class="join-item btn-disabled">...</button>

                        <button onclick={indexHandler.incrementIndex} class="join-item btn rounded-md" aria-label="increment-index">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Tarjetas de Justificaciones -->
            <div class="w-full mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {#if justificaciones}
                    {#each justificaciones as justificacion, i(justificacion)}
                        {@const vigencia = checkVigencia(justificacion.fecha_inicio, justificacion.fecha_finalizacion)}

                        <div class="border border-base-content/40 rounded-md
                            shadow-md bg-base-200 animate-pop-delayed *:px-4"
                            style="--delay: {i * 100}ms">
                            <!-- HEADER -->
                            <div class="w-full min-h-8
                            bg-base-200 rounded-md py-1
                            flex items-end justify-between text-xs">

                                <div class="flex items-end justify-between gap-3">
                                    <div class="form-control">
                                        <div class="label p-0 m-0">
                                            <b class="label-text text-neutral/70">Fecha de Creacion</b>
                                        </div>
                                        <b>{new Date(justificacion.created_at).toLocaleDateString('es')}</b>
                                    </div>

                                    <div class="form-control">
                                        <div class="label p-0 m-0">
                                            <b class="label-text text-neutral/70">Creado por:</b>
                                        </div>
                                        <b>{justificacion.nombre_encargado} {justificacion.apellido_encargado}</b>
                                    </div>
                                </div>

                                <div class="flex items-end justify-between">
                                    <div class="form-control">
                                        <div class="label p-0 m-0">
                                            <b class="label-text text-neutral/70">Empleado:</b>
                                        </div>
                                        <b>{justificacion.nombre_empleado} {justificacion.apellido_empleado}</b>
                                    </div>
                                </div>
                            </div>

                            <!-- BODY -->
                            <div class="w-full min-h-32 p-2
                            bg-base-100 border-y border-base-content/40
                            flex items-start justify-between gap-4">
                                <div class="border border-base-content/60 w-1/3 h-full">
                                    <img src="/downloads/000?path={justificacion.path}&type=comprobante" alt="" class="w-full h-40">
                                </div>

                                <div class="w-2/3 h-full py-2 flex flex-col justify-between items-start">
                                    <div class="w-full">
                                        <h3 class="text-lg font-semibold">Razon: {justificacion.razon}</h3> 
                                        <p class="text-xs">Tipo: {justificacion.tipo}</p>
                                        <p><b class="{vigencia === "Vigente" ? "text-success" : vigencia === "Expirado" ? "text-error" : "text-warning"}">{vigencia}</b> </p>                                   
                                        <!-- <p class="text-sm">{justificacion.detalles}</p> -->
                                        <div class="form-control text-xs mt-2">
                                            <div class="label p-0 m-0">
                                                <b class="label-text">Fecha:</b>
                                            </div>
                                            <p>Desde {new Date(justificacion.fecha_inicio).toLocaleDateString()} hasta {new Date(justificacion.fecha_finalizacion).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div class="w-full flex items-center justify-end mt-3">
                                        <a href="{basePath}/justificaciones/{justificacion.id}" class="btn btn-sm bg-base-content text-base-100">
                                            <span>Administrar</span>
                                        </a >
                                    </div>
                                </div>
                            </div>

                            <!-- FOOTER -->
                            <div class="w-full min-h-4 bg-base-200 rounded-md">

                            </div>
                        </div>
                    {/each}       
                {/if}
            </div>
        {:else}
            <div class="w-full flex items-center justify-center p-8 animate-pop">
                <div class="text-center">
                    <img src="{no_result}" alt="" class="max-w-[200px] mx-auto mb-4">
                    <h2 class="font-bold text-xl">No se encontró ningún resultado</h2>
                    <p class="text-base-content/70 mt-2">Intenta con diferentes filtros o términos de búsqueda</p>
                </div>
            </div>
        {/if}
    </div>
</div>