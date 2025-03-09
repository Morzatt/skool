<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import { basePath } from '$lib';
    import type { PageData } from './$types';
    import FilterSelect from './FilterSelect.svelte';

    let { data }: { data: PageData } = $props();
    let { empleados } = $derived(data)

    let index = $state(0)
    let filter = $state("")
    let search = $state("")
    let estado = $state("")
    let turno = $state("")
    let departamento = $state('departamentos')

    let url = $derived(`${basePath}/alumnos?index=${index}&filter=${filter === "Filtro"?"":filter}&search=${search}&estado=${estado}&turno=${turno}&departamento=${departamento}`) 

    let indexHandler = {
        incrementIndex: async () => {
            if (empleados!.length <= 14) return;
            index += 15
            handleSearch()
        },

        decrementIndex: async () => {
            if (index === 0) return;
            index -= 15
            handleSearch()
        }
    }

    async function handleSearch() {
        await invalidateAll()
        goto(url)
    }
</script>

<div class="*: w-full min-h-full lg:h-full">
    <div class="w-full h-12
        flex items-center justify-between flex-wrap">
        <h1 class="text-2xl font-semibold">Empleados</h1>

        <div class="w-max flex items-center justify-between gap-3 flex-wrap">
            <div class="join border border-base-content/60">
                <label class="input join-item flex items-center justify-start gap-2 focus:outline-0 outline-0">
                    <i class="fa-solid fa-user-tie"></i>
                    <input type="search" class="outline-0 focus:outline-0" placeholder="Buscar empleados..."/>

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

    <div class="w-full h-max mt-4 bg-base-200 rounded-md px-4 pb-3 flex items-end justify-between flex-wrap">
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

        <div class="flex items-center justify-start gap-2 flex-wrap">
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
                <FilterSelect bind:value={departamento} name="Departamento" type="dropdown-bottom" styles="" icon="fa-solid fa-briefcase" options={[
                    {
                        name: "Docentes",
                        value: "docentes"
                    },
                    {
                        name: "Administrativos",
                        value: "administrativos"
                    },
                    {
                        name: "Obreros",
                        value: "obreros"
                    },
                    {
                        name: "Obreros",
                        value: "obreros"
                    },
                ]}/>
            </div>
        </div>
    </div>

    <div class="w-full h-max mt-4 bg-base-300 rounded-md">
        <table class="table mt-2 text-center flex">
            <thead>
                <tr class="bg-secondary [&_span]:font-bold">
                    <th class="rounded-l-lg" ><span class="text-sm font-medium text-base-content ext-base-100">#</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Cédula</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Nombre</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Apellido</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Sexo</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Fecha de Nacimiento</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Edad</span></th>
                    <th><span class="text-sm font-medium text-base-content ext-base-100">Estado</span></th>
                    <th class="rounded-r-lg"><span class="text-sm font-medium text-base-content ext-base-100">Administrar</span></th>
                </tr>
            </thead>
            <tbody>
                {#if false}
                    {#each empleados as empleado , i(empleado)}
                        <tr class="border-0 border-base-content/30 shadow-sm">
                            <th>{(i+1)+index}</th>
                            <th>{empleado.cedula}</th>
                            <th>{empleado.primer_nombre}</th>
                            <th>{empleado.primer_apellido}</th>
                            <th>{empleado.sexo}</th>
                            <th>{new Date(empleado.fecha_nacimiento).toLocaleDateString()}</th>
                            <th>{empleado.edad}</th>
                            <th>{empleado.estado}</th>
                            <th>
                                <a class="btn btn-sm btn-square" href="{basePath}/alumnos/{empleado.cedula}">
                                    <img src="{ver_icon}" alt="" class="icon">
                                </a>
                            </th>
                        </tr>
                    {/each}                                       
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style lang="postcss">
    * {
        @apply focus:outline-0;
    }
</style>