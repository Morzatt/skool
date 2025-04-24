<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import type { Departamento, Empleado } from "$lib/database/types";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

    let { form, departamento }: { form: any, departamento: Departamento & { empleados: number, listaEmpleados: Empleado[] } } = $props()

    let editNombre: boolean = $state(false)
    let editDescripcion: boolean = $state(false)
</script>

<dialog id="departameno_{departamento.id_departamento}_modal" class="modal modal- modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-300 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-3xl overflow-hidden shadow-lg border border-base-content/10">
        <!-- <Alert form={ form } styles="absolute left-2 top-2 max-w-sm"/> -->

        <form method="dialog">
            <button type="submit" id="departamento_{departamento.id_departamento}_close" aria-label="close-modal" 
            class="hover:text-error transition-all duration-300 absolute top-4 right-4 hover:rotate-90 hover:scale-110">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <div class="font-bold mt-3 items-center justify-start w-full">
            <div class="flex items-center justify-start w-fit gap-4 bg-base-200 p-4 rounded-lg shadow-sm">
                <i class="fa-solid {departamento.icon} mr-4 text-4xl"></i> 
                <div>
                    <p class="text-lg font-bold text-base-content">Administrar Departamento</p>
                    <p class="text-2xl">{departamento.nombre_departamento}</p>               
                </div>
            </div>

            <button class="rounded-md mt-4
                px-4 py-1 group
                btn-sm
                btn btn-error btn-outline 
                w-fit 
                flex items-center justify-between gap-2 
                hover:shadow-md transition-all duration-300 ease-in-out" 
                onclick="{() => { document.getElementById(`delete_departamento_${departamento.id_departamento}`).showModal() }}">

                <img src="{delete_icon}" alt="" class="red-filter group-hover:invert transition-all duration-300">
                <p class="group-hover:text-white">Eliminar</p>
            </button> 
        </div>

        <div class="divider m-0 mt-5 p-0 before:bg-base-content/30 after:bg-base-content/30"></div>

        <div class="w-full overflow-y-auto 
                flex flex-col gap-4 items-center justify-start">

                <!-- CEDULA, NOMBRE Y APELLIDO, DEPARTAMENTO Y CARGO -->
                <div class="w-full border border-base-content/10 rounded-lg mt-4 p-4 shadow-md bg-base-200/50">
                    <h3 class="font-semibold text-lg"> <i class="fa-solid fa-briefcase"></i> Detalles del Departamento</h3>

                    <div class="w-full mt-5 flex flex-col sm:flex-row items-start justify-between gap-5">
                        <div class="w-full flex flex-col gap-4 *:shadow-md">
                            <div class="w-full h-full bg-base-100 rounded-lg p-3 hover:shadow-lg transition-all duration-200">
                                <div class="flex items-center justify-between">
                                    <b class="label-text text-base">Nombre del Departamento</b>
                                    <button id="laboral_close" class="btn btn-sm btn-circle transition-colors duration-200" aria-label="edit-button"
                                    onclick={()=>{ editNombre = !editNombre }}>
                                        <i class="fa-solid fa-pencil"></i>
                                    </button>
                                </div>
                                {#if editNombre}
                                    <label class="input input-bordered animate-pop mt-4 flex items-center justify-start gap-3">
                                        <i class="fa-regular fa-square-plus text-2xl"></i>
                                        <input type="text" name="nombre_departamento" class="grow" placeholder='Ej. "Docentes", "Administración", etc...' />
                                    </label>
                                {:else}
                                    <p class="mt-2 text-base-content/80 animate-pop">{departamento.nombre_departamento}</p> 
                                {/if}
                            </div>

                            <div class="w-full h-full bg-base-100 rounded-lg p-3 hover:shadow-lg transition-all duration-200">
                                <div class="flex items-center justify-between">
                                    <b class="label-text text-base">Descripción del Departamento</b>
                                    <button id="laboral_close" class="btn btn-sm btn-circle transition-colors duration-200" aria-label="edit-button"
                                    onclick={()=>{ editDescripcion = !editDescripcion }}>
                                        <i class="fa-solid fa-pencil"></i>
                                    </button>
                                </div>
                                {#if editDescripcion}
                                    <fieldset class="fieldset w-full mt-4 animate-pop">
                                        <legend class="fieldset-legend font-bold text-sm mb-1">Descripcion del Departamento</legend>
                                        <textarea class="textarea textarea-bordered w-full min-h-24" name="descripcion" placeholder="Descripcion..."></textarea>
                                    </fieldset>
                                {:else}
                                    <p class="mt-2 text-base-content/80 animate-pop">{departamento.descripcion}</p> 
                                {/if}
                            </div>
                        </div>


                        <div class="w-full h-full bg-base-100 rounded-lg p-4 shadow-md">
                            <div class="font-semibold flex items-center justify-between w-full">
                                <span class="text-base"><i class="fa-solid fa-person"></i> Empleados del Departamento</span>
                                <button id="laboral_close" class="btn btn-sm btn-circle bg-success text-success-content hover:bg-success-focus transition-colors duration-200" aria-label="edit-button"
                                onclick={()=>{}}>
                                    <i class="fa-solid fa-user-plus"></i>
                                </button>
                            </div> 

                            <div class="flex flex-col gap-3 w-full mt-3 max-h-[20rem] overflow-y-auto pr-2">
                                {#each departamento.listaEmpleados as empleado}
                                    <div class="w-full shadow-md p-3 flex items-center justify-between rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-200">
                                        <div class="w-fit h-full flex items-center justify-between gap-4">
                                            <i class="fa-solid fa-user text-xl px-2.5 p-1 text-center rounded-full"></i>
                                            <div>
                                                <p class="font-medium">{capitalizeFirstLetter(empleado.primer_nombre)} {capitalizeFirstLetter(empleado.primer_apellido)}</p>
                                                <p class="text-sm text-base-content/70">{empleado.cargo}</p>
                                            </div>
                                        </div>

                                        <div class="flex items-center justify-center gap-3">
                                            <a href="/empleados/{empleado.cedula}" class="text-lg btn btn-sm btn-square p-1 transition-colors duration-200" aria-label="button">
                                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                            </a>


                                            <form action="?/deleteFromDepartamento" method="post" use:enhance>
                                                <input type="hidden" name="cedula" value="{empleado.cedula}">
                                                <button aria-label="clo" data-tip="Eliminar del Departamento"
                                                class="text-error hover:text-error/70 transition-all duration-200 ease-in-out flex items-center justify-center tooltip-top hover:scale-110">
                                                    <i class="fa-solid fa-circle-xmark text-3xl"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                {:else}
                                    <div class="w-full p-4 text-center text-base-content/60 bg-base-200 rounded-lg">
                                        No hay empleados asignados a este departamento
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

            <button type="submit" class="btn btn-success text-success-content px-12 mt-2 mb-2 hover:scale-105 transition-transform duration-200">
                <span>Crear</span>
            </button>   
        </div>     
    </div>
    <div class="modal-backdrop bg-neutral opacity-30"></div>
</dialog>


<dialog id="delete_departamento_{departamento.id_departamento}" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-100 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-16 shrink-0 stroke-current red-filter"
            fill="none"
            viewBox="0 0 24 24">
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h3 class="text-lg mt-3 text-center">¿Seguro que desea eliminar este Departamento?</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center leading-tight">Esta acción es irreversible; se eliminarán completamente todos los datos del del departamento, mientras su personal quedara con el estado 'Departamento no Asignado'</p>

        <div class="w-fit gap-3 mt-4 flex">
            <form method="dialog">
                <button type="submit" class="btn btn-sm">Volver</button>
            </form>
            
            <form action="?/deleteDepartamento" method="POST" use:enhance>
                <input type="hidden" name="id_departamento" value="{departamento.id_departamento}">
                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .file-label {
        @apply w-[10rem] min-h-[9rem] relative
        flex flex-col items-center justify-center
        border-2 rounded-lg border-dashed
        shadow-md
        cursor-pointer p-2 gap-4
        transition-all duration-200 ease-in-out
        origin-left
        active:bg-base-300;
        --delay: 100ms;
    }

    .file-label:hover {
        @apply drop-shadow-2xl shadow-xl
        border-0;

        img {
            @apply filter invert;
        }
    }
    
    .form-control {
        @apply my-3;
    }
    .form-control .label { 
        @apply h-fit p-0;
    }
    .form-control .label .label-text {
        @apply font-bold;
    }

    .input {
        @apply input-bordered focus:outline-0 focus:ring-2 input-sm w-full;
    }
    
    /* Scrollbar styles */
    ::-webkit-scrollbar {
        width: 6px;
    }
    
    ::-webkit-scrollbar-track {
        @apply bg-base-200 rounded-full;
    }
    
    ::-webkit-scrollbar-thumb {
        @apply rounded-full transition-colors duration-200;
    }
</style>