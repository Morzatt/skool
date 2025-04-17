<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto, invalidateAll } from '$app/navigation';
    import { basePath } from '$lib';
    import type { EstadosEmpleado } from '$lib/database/types';
    import type { PageData } from './$types';
    import FilterSelect from './FilterSelect.svelte';

    let { data }: { data: PageData } = $props();
    let { departamentos } = $derived(data)

    let turno = $state("")

    let url = $derived(`${basePath}/alumnos?turno=${turno}`) 

    async function handleSearch() {
        await invalidateAll()
        goto(url)
    }

    function asignColor(status: EstadosEmpleado): string {
        switch (status) {
            case "Activo": 
                return "text-base-100 bg-success"
            case "Inhabilitado":
                return "text-base-200 bg-error"
            case "Despedido":
                return "text-red-900 bg-error"
            default: 
                return "text-yellow-900 bg-warning"
        }
    }

    let icons = [
        'fa-solid fa-school',
        'fa-solid fa-briefcase',
        'fa-solid fa-building',
        'fa-solid fa-user-nurse',
        'fa-solid fa-dumbbell',
        'fa-solid fa-vial-circle-check',
        'fa-solid fa-user-doctor',
        'fa-solid fa-brain',
        'fa-solid fa-chalkboard',
        'fa-solid fa-graduation-cap',
        'fa-solid fa-book',
        'fa-solid fa-scroll',
        'fa-solid fa-microphone-lines',
        'fa-solid fa-camera',
        'fa-solid fa-truck',
    ]
</script>

<div class="*: w-full min-h-full lg:h-full">
    <div class="w-full h-12
        flex items-center justify-between flex-wrap">
        <h1 class="text-2xl font-semibold">Departamentos</h1>
    </div>

    <div class="w-full h-max mt-4 bg-primary/20 rounded-md px-4 pb-3 flex items-end justify-between flex-wrap">
        <div class="flex items-center justify-start w-max h-full">
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Crear Departamento</b>
                </div>
                <button class="btn btn-sm btn-success mt-2
                flex items-center justify-center
                text-base-100"
                onclick="{() => {document.getElementById('create_departamento_modal').showModal()}}">
                    <i class="fa-solid fa-hammer"></i>
                    <span>Nuevo</span>
                </button>
            </div>
        </div>
        <div class="flex items-center justify-start gap-2 flex-wrap">
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
        </div>
    </div>

    <div class="w-full mt-4">
        <h3 class="text-xl font-medium">Todos los Departamentos</h3>
    </div>

    <div class="w-full h-max mt-4 p-4 pb-8 bg-base-300 rounded-md grid grid-cols-3 items-start gap-2 gap-y-6">
        {#if departamentos}
            {#each departamentos as departamento, i}
                <div class="stack h-full *:h-full animate-pop" style="--delay: {i*100}ms">
                    <div class="card shadow-md bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title"><i class="{departamento.icon}"></i>{departamento.nombre_departamento}</h2>
                            <p>{departamento.descripcion}</p>
                            <div class="w-full h-12 flex items-center justify-between">
                                <div class="text-sm">
                                    <span><b>Personal:</b> {departamento.empleados}</span>
                                </div>
                                <button class="btn bg-base-content text-base-100">
                                    Administrar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow-md bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">Notification 2</h2>
                            <p>You have 3 unread messages. Tap here to see.</p>
                        </div>
                    </div>
                    <div class="card shadow-md bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">Notification 3</h2>
                            <p>You have 3 unread messages. Tap here to see.</p>
                        </div>
                    </div>
                </div>
            {/each}           
        {/if}
    </div>
</div>

<dialog id="create_departamento_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-100 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-md overflow-hidden ">

        <form method="dialog">
            <button type="submit" id="create_departamento_close" aria-label="close-modal" 
            class="hover:text-error transition-all duration-200 ease-in-out absolute top-4 right-4">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <h3 class="text-lg mt-3">Crear Nuevo Departamento</h3>
        <p class="text-xs text-base-content/60">Introduzca el nombre del departamento a crear para comenzar a añadir empleados a ésta nueva área de trabajo</p>

        <form action="?/create" method="post" use:enhance class="w-full gap-3 mt-4 flex flex-col items-center overflow-y-auto thin">
            <div class="form-control w-fit">
                <div class="label">
                    <b class="label-text">Nombre del Nuevo Departamento</b>
                </div>
                <label class="input input-bordered flex items-center justify-start gap-3">
                    <i class="fa-regular fa-square-plus text-2xl"></i>
                    <input type="text" name="nombre_departamento" class="grow" placeholder='Ej. "Docentes", "Administración", etc...' />
                </label>
            </div>

            <fieldset class="fieldset w-full mt-3">
                <legend class="fieldset-legend font-bold text-sm mb-1">Descripcion del Departamento</legend>
                <textarea class="textarea textarea-bordered w-full min-h-24" name="descripcion" placeholder="Descripcion..."></textarea>
            </fieldset>

            <div class="form-control w-full">
                <div class="label">
                    <b class="label-text">Escoja un Icono</b>
                </div>
                <div class="border shadow-md border-base-content p-3 rounded-xl max-w-sm 
                 grid grid-cols-4
                 gap-3 flex-wrap">
                    {#each icons as icon}
                        <div class="size-fit flex text-3xl">
                           <label class="hover:bg-base-content hover:text-base-100 transition-all duration-200
                           border border-base-content p-1 rounded-md cursor-pointer">
                                <input type="radio" class="radio" name="departamento_icon" value="{icon}">
                                <i class="{icon}"></i> 
                           </label>
                        </div> 
                    {/each}
                </div>
            </div>

            <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" 
                class="btn btn-sm btn-success text-base-100 px-8">Crear Departamento</button>
        </form>
    </div>
</dialog>

<style lang="postcss">
    * {
        @apply focus:outline-0;
    }
    .thin {
        scrollbar-width: thin;
    }
</style>