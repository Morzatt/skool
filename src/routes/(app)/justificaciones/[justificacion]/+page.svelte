<script lang="ts">
    import { basePath } from '$lib';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import type { ActionData, PageData } from './$types';
    import Alert from '$lib/components/Messages/Alert.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { justificacion, comprobantes } = $derived(data)
</script>

<div class="size-full relative">
    <Alert form={ form } styles="absolute top-4 left-4 max-w-sm"/>
    <div class="h-fit w-full mb-4 relative flex items-center justify-between">
        <a href="{basePath}/empleados" class="btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
        data-tip="Administrar Empleados">
            <img src="{chevron}" alt="">
        </a>

        <h3 class="text-3xl font-bold">Justificacion</h3>
    </div>

    <div class="w-full px-4 h-[calc(100%-(1rem+2rem))] mt-3">
        <div class="w-full h-full p-4
                    bg-base-300 rounded-md shadow-md border border-base-300
                     animate-pop">

            <div class="w-full h-full  
                flex items-start justify-center gap-3
                animate-pop-delayed" style="--delay: 150ms">

                <div class="w-3/5 h-full border border-base-content/30 rounded-md p-4">
                    <div class="w-full h-[calc(100%-(0.75rem+0.5rem+1rem))]">
                        <div class="w-full bg-base-200 rounded-md p-4">
                            <div class="flex flex-col items-center justify-center relative">
                                <i class="text-xs absolute top-0 right-0">{new Date(justificacion.created_at).toLocaleDateString()}</i>
                                <i class="fa-regular fa-file-lines text-5xl"></i>
                                <b class="text-xl">Razon: Enfermedad</b>
                                <p class="text-xs">Tipo: {justificacion.tipo}</p>
                                <p>Estado: Vigente</p>
                            </div>

                            <div class="flex items-center justify-between text-sm mt-1">
                                <div>
                                    <b>Fecha de Inicio</b>
                                    <p>Desde el {new Date(justificacion.fecha_inicio).toLocaleDateString()}</p>
                                </div>
                                <div class="text-end">
                                    <b>Fecha de Finalización</b>
                                    <p>Hasta el {new Date(justificacion.fecha_finalizacion).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="divider p-0 m-0 mt-3"></div>
                            <div class="flex items-center justify-start gap-10 text-sm mt-4">
                                <div class="w-full">
                                    <b>Detalles</b>
                                    <p class="text-wrap w-full">{justificacion.detalles}</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mt-4">
                            <h3 class="font-semibold"><i class="fa-solid fa-person"></i> Detalles del Empleado</h3>
                            <a href="{basePath}/empleados/{justificacion.empleado}" class="text-lg btn bg-base-content text-base-100 btn-sm btn-square p-1" aria-label="button">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </div>
                        <div class="w-full h-fit p-2 mt-2
                                bg-base-200 rounded-md
                                flex items-center justify-start gap-8">
                            <div>
                                <b>Cedula</b>
                                <p>{justificacion.nacionalidad == "Extranjero" ? "E-" : "V-"}{justificacion.cedula} </p>
                            </div>
                            <div>
                                <b>Empleado</b>
                                <p>{justificacion.primer_nombre} {justificacion.primer_apellido}</p>
                            </div>
                             <div>
                                <b>Turno</b>
                                <p>{justificacion.turno} </p>
                            </div>                           
                        </div>
                    </div>
                </div>

                <div class="w-2/5 h-full border border-base-content/30 rounded-md p-2">
                    <h3 class="font-semibold"> <i class="fa-solid fa-file-contract"></i> Comprobantes Físicos</h3>

                    <div class="w-full h-[calc(100%-(0.75rem+0.5rem+1.4rem))] mt-3">
                        <div class="w-full h-full 
                                bg-base-200 rounded-md 
                                p-2 
                                grid grid-cols-3 gap-3
                                overflow-y-scroll">

                            {#if comprobantes}
                                {#each comprobantes as comprobante}
                                    <div class="h-max relative group">
                                        <div class="size-full bg-black/60
                                                    absolute top-0 left-0
                                                    hidden
                                                    group-hover:flex items-center justify-center
                                                    transition-all duration-200 ease-in-out animate-pop">

                                            <button class="btn btn-sm btn-accent" aria-label="button"
                                            onclick="{() => {document.getElementById(`comprobante_${comprobante.id_comprobante}`).showModal()}}">
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                        </div>
                                        <img src="{comprobante.path}" alt="" class="border border-base-content/30"> 
                                    </div>
                                    <!-- MODAL -->
                                    <dialog id="comprobante_{comprobante.id_comprobante}" class="modal modal- sm:modal-middle">
                                        <div class="modal-box relative
                                        bg-transparent shadow-none
                                        flex items-start justify-between gap-4
                                        sm:w-10/12 sm:max-w-4xl h-[100%] overflow-hidden">

                                            <div class="button-container">
                                                <button aria-label="bu"><i class="fa-solid fa-circle-chevron-left"></i></button>
                                            </div>
                                            
                                            <div class="img-container h-full overflow-auto">
                                                <img src="{comprobante.path}" alt="" class="border border-base-content/30"> 
                                            </div>

                                            <div class="button-container">
                                                <button aria-label="bu"><i class="fa-solid fa-circle-chevron-right"></i></button>
                                            </div>
                                        </div>

                                        <form method="dialog" class="modal-backdrop bg-black">
                                            <button>close</button>
                                        </form>
                                    </dialog>
                                {/each}
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<style lang="postcss">
    .modal-box .button-container {
        @apply h-full flex items-center justify-center text-6xl;
        button {
            @apply text-accent hover:text-base-300 transition-all duration-200 ease-in-out;
        }
    }

    .form-control {
        @apply my-2;
    }
    .form-control .label { 
        @apply h-fit p-0 px-2 py-1;
    }
    .form-control .label .labe-text {
        @apply font-bold;
    }

    .input {
        @apply input-bordered focus:outline-0 input-sm w-full;
    }
</style>