<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import { basePath, formatStringWithDots } from '$lib';
    import type { EstadosEmpleado } from '$lib/database/types';
    import type { PageData } from './$types';
    import FilterSelect from './FilterSelect.svelte';
    import no_result from "$lib/images/3e01667b4c12daee9ea2a1cfabe58e2d.png"

    let { data }: { data: PageData } = $props();
    let { empleados, records, total } = $derived(data)

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

    let url = $derived(`${basePath}/empleados?index=${index}&filter=${filter === "Filtro"?"":filter}&search=${search}&estado=${estado}&turno=${turno}&departamento=${departamento}`)//&cOrder=${cedula}&nOrder=${nombre}&aOrder=${apellido}&fOrder=${fecha}`) 

    let indexHandler = {
        incrementIndex: async () => {
            if (empleados && empleados.length <= 9) return;
            index += 10
            animate = "animate-x"
            handleSearch()
        },

        decrementIndex: async () => {
            if (index === 0) return;
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
        if (i >= total || i <= empleados!.length) { return }
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
</script>

<div class="*: w-full min-h-full lg:h-full">
    <div class="w-full h-12
        flex items-center justify-between flex-wrap">
        <h1 class="text-2xl font-semibold">Empleados</h1>

        <div class="w-max flex items-center justify-between gap-3 flex-wrap">
            <div class="join border border-base-content/60">
                <label class="input join-item flex items-center justify-start gap-2 focus:outline-0 outline-0">
                    <i class="fa-solid fa-user-tie"></i>
                    <input bind:value={search} type="search" class="outline-0 focus:outline-0" placeholder="Buscar empleados..."
                    oninput="{handleSearch()}"/>

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

            <FilterSelect bind:value={filter} name="Filtro" type="dropdown-left" styles="rounded-md" icon="fa-solid fa-filter" options={[
                {
                    name: "Cedula",
                    value: "cedula"
                },
                {
                    name: "Nombre",
                    value: "primer_nombre"
                },
                {
                    name: "Apellido",
                    value: "primer_apellido"
                }
            ]}/>
        </div>
    </div>

    <div class="w-full h-max mt-4 bg-primary/20 rounded-md px-4 pb-3 flex items-end justify-between flex-wrap">
        <div class="flex items-center justify-start w-max h-full">
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Registrar Empleado</b>
                </div>
                <a class="btn btn-sm btn-success mt-2
                flex items-center justify-center
                text-base-100" href="/empleados/create">
                    <span><i class="fa-solid fa-user-plus"></i></span>
                    <span>Registrar</span>
                </a>
            </div>
        </div>

        <div class="flex items-end justify-start gap-2 flex-wrap">
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Estado</b>
                </div>
                <FilterSelect bind:value={estado} name="Estado" type="dropdown-bottom" styles="" icon="fa-solid fa-user-check" options={[
                    {
                        name: "Activo",
                        value: "activo"
                    },
                    {
                        name: "De Reposo",
                        value: "reposo"
                    },
                    {
                        name: "Inhabilitado",
                        value: "inhabilitado"
                    },
                    {
                        name: "Despedido",
                        value: "despedido"
                    },
                ]}/>
            </div>
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Turnos</b>
                </div>
                <FilterSelect bind:value={turno} name="Turno" type="dropdown-bottom" styles="" icon="fa-solid fa-cloud-sun" options={[
                    {
                        name: "Mañana",
                        value: "mañana"
                    },
                    {
                        name: "Tarde",
                        value: "tarde"
                    },
                ]}/>
            </div>
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Departamentos</b>
                </div>
                <FilterSelect bind:value={departamento} name="Departamento" type="dropdown-bottom" styles="" icon="fa-solid fa-briefcase" 
                options={
                    data.departamentos !== undefined ? 
                        data.departamentos.map((i) => {
                            return {
                                name: i.nombre_departamento,
                                value: i.id_departamento
                            }
                        }) : 
                [{ name: "No hay departamentos creados", value: "" }]}/>
            </div>

            <button aria-label="clear-search" 
            class="{index || filter || search || estado || turno || departamento ? "block" : "hidden"} 
            hover:text-error animate--x
            transition-all duration-200 ease-in-out 
            mb-0.5 mx-6 
            origin-right 
            tooltip tooltip-top"
            data-tip="Limpiar Filtros"
            onclick={clearAll}>
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </div>
    </div>

    <div class="w-full h-max rounded-md px-4 flex items-end justify-between flex-wrap">
        <div class="form-control ">
            <div class="label">
                <b class="label-text">Imprimir Lista</b>
            </div>

            <button class="btn btn-sm bg-base-content text-base-100 px-6 rounded-xl" aria-label="print-list">
                <i class="fa-solid fa-print"></i>
            </button>
        </div>

        <div class="form-control">
            <div class="label justify-end px-4">
                <b class="label-text">Pág. {index/10 === 0 ? 1 : index/10} de {Math.round(total/10)}</b>
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

    <div class="w-full h-max mt-4 bg-base-300 rounded-md flex items-center justify-center ">
        {#if empleados && empleados.length > 0}
            <table class="table mt-2 text-center flex w-full animate-pop ">
                <thead class="">
                    <tr class="bg-accent [&_span]:font-bold">
                        <th class="rounded-l-lg hidden lg:table-cell">
                            <span class="text-sm font-medium text-base-content ext-base-100">#</span>
                        </th>
                        <th>
                            <div class="flex items-center justify-center gap-2">
                                <div class="text-sm text-secondary-content ext-base-100">Cédula</div>
                                <label class="swap swap-rotate">
                                    <input type="checkbox" onclick={() => {cedula = cedula == "asc" ? "desc" : "asc"; handleSearch();}}/>
                                    <i class="text-xl swap-on fa-solid fa-circle-chevron-down"></i>
                                    <i class="text-xl swap-off fa-solid fa-circle-chevron-up"></i>
                                </label>
                            </div>
                        </th>
                        <th>
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-medium text-secondary-content ext-base-100">Nombre</span>
                                <label class="swap swap-rotate">
                                    <input type="checkbox" onclick={() => { nombre= nombre == "asc" ? "desc" : "asc"; handleSearch(); }}/>
                                    <i class="text-xl swap-on fa-solid fa-circle-chevron-down"></i>
                                    <i class="text-xl swap-off fa-solid fa-circle-chevron-up"></i>
                                </label>
                            </div>
                        </th>
                        <th>
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-medium text-secondary-content ext-base-100">Apellido</span>
                                <label class="swap swap-rotate">
                                    <input type="checkbox" onclick={() => { apellido = apellido == "asc" ? "desc" : "asc"; handleSearch(); }}/>
                                    <i class="text-xl swap-on fa-solid fa-circle-chevron-down"></i>
                                    <i class="text-xl swap-off fa-solid fa-circle-chevron-up"></i>
                                </label>
                            </div>
                        </th>
                        <th class="hidden lg:table-cell" >
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-medium text-secondary-content ext-base-100">Sexo</span>
                                <label class="swap swap-rotate">
                                    <input type="checkbox"/>
                                    <i class="text-xl swap-on fa-solid fa-circle-chevron-down"></i>
                                    <i class="text-xl swap-off fa-solid fa-circle-chevron-up"></i>
                                </label>
                            </div>
                        </th>
                        <th class="hidden lg:table-cell">
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-medium text-secondary-content ext-base-100">Fecha de Nacimiento</span>
                                <label class="swap swap-rotate">
                                    <input type="checkbox" onclick={() => { fecha = fecha == "asc" ? "desc" : "asc"; handleSearch(); }}/>
                                    <i class="text-xl swap-on fa-solid fa-circle-chevron-down"></i>
                                    <i class="text-xl swap-off fa-solid fa-circle-chevron-up"></i>
                                </label>
                            </div>
                        </th>
                        <th class="hidden lg:table-cell">
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-medium text-secondary-content ext-base-100">Edad</span>
                            </div>
                        </th>
                        <th class="hidden sm:table-cell">
                            <div class="flex items-center justify-center gap-2">
                                <span class="text-sm font-medium text-secondary-content ext-base-100">Estado</span>
                            </div>
                        </th>
                        <th class="rounded-r-lg"><span class="text-sm font-medium text-base-content ext-base-100">Administrar</span></th>
                    </tr>
                </thead>
                <tbody>
                    {#each empleados as empleado , i(empleado)}
                        <tr class="border-0 border-base-content/30 shadow-sm animate-pop-delayed" style="--delay: {i*100}ms;">
                            <th class="hidden lg:table-cell">{(i+1)+index}</th>
                            <th>{empleado.nacionalidad === "Venezolano" ? "V-" : "E-"} {formatStringWithDots(empleado.cedula)}</th>
                            <th>{empleado.primer_nombre}</th>
                            <th>{empleado.primer_apellido}</th>
                            <th class="hidden lg:table-cell">{empleado.sexo}</th>
                            <th class="hidden lg:table-cell">{new Date(empleado.fecha_nacimiento).toLocaleDateString()}</th>
                            <th class="hidden lg:table-cell">{empleado.edad}</th>
                            <th class="hidden sm:table-cell">
                                <span class=" px-4 rounded-md py-1 font-bold {asignColor(empleado.estado)}">{empleado.estado}</span>
                            </th>
                            <th>
                                <a class="btn btn-sm rounded-md btn-square text-center" href="{basePath}/empleados/{empleado.cedula}" aria-label="administrar">
                                    <i class="fa-solid fa-pen-to-square text-xl"></i>
                                </a>
                            </th>
                        </tr>
                    {/each}                                       
                </tbody>
            </table>
        {:else}
            <div class="w-fit p-6 animate-pop">
                <img src="{no_result}" alt="">
                <h2 class="font-bold text-xl">No se encontró ningún resultado</h2>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    * {
        @apply focus:outline-0;
    }
</style>