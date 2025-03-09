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

    <div class="w-full h-max mt-4 p-4 bg-base-300 rounded-md grid grid-cols-3 gap-2">
        {#if departamentos}
            {#each departamentos as departamento}
                <div class="p-2 bg-base-100 rounded-md">
                    <div>
                        <span>{departamento.nombre_departamento}</span>
                        <span>{departamento.empleados}</span>
                    </div>
                </div>
            {/each}           
        {/if}
    </div>
</div>

<dialog id="create_departamento_modal" class="modal modal- modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-100 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-md overflow-hidden">

        <form method="dialog">
            <button type="submit" id="create_departamento_close" aria-label="close-modal" 
            class="hover:text-error transition-all duration-200 ease-in-out absolute top-4 right-4">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <h3 class="text-lg mt-3">Crear Nuevo Departamento</h3>
        <p class="text-xs text-base-content/60">Introduzca el nombre del departamento a crear para comenzar a añadir empleados a ésta nueva área de trabajo</p>

        <form action="?/create" method="post" use:enhance class="w-fit gap-3 mt-4 flex flex-col">
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Nombre del Nuevo Departamento</b>
                </div>
                <label class="input input-bordered flex items-center justify-start gap-3">
                    <i class="fa-regular fa-square-plus text-2xl"></i>
                    <input type="text" name="nombre_departamento" class="grow" placeholder='Ej. "Docentes", "Administración", etc...' />
                </label>
            </div>

            <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" 
                class="btn btn-sm btn-success text-base-100">Crear</button>
        </form>
    </div>
</dialog>

<style lang="postcss">
    * {
        @apply focus:outline-0;
    }
</style>