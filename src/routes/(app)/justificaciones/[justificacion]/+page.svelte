<script lang="ts">
    import { basePath } from '$lib';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import copy_icon from "$lib/images/icons/copy_icon.svg"
    import cancelar_icon from "$lib/images/icons/cancelar_icon.svg"
    import Alert from '$lib/components/Messages/Alert.svelte';
    import { enhance } from '$app/forms';
    import type { EstadosEmpleado } from '$lib/database/types';
    import { checkVigencia } from '$lib/utils/vigencia';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { justificacion, comprobantes, encargado } = $derived(data)

    const vigencia = $derived(checkVigencia(justificacion.fecha_inicio, justificacion.fecha_finalizacion))

    function asignColor(status: EstadosEmpleado): string {
        switch (status) {
            case "Activo": 
                return "text-green-900 bg-success/50"
            case "Inhabilitado":
                return "text-error-content/50 bg-error/50"
            default: 
                return "text-yellow-900 bg-warning/50"
        }
    }
    function add(node: HTMLElement, c: string[]) {
        for (let i of c) {
           node.classList.add(i) 
        }
    }

    async function setImage(index: number) { 
        let container = document.getElementById(`comprobante_container_${index}`) as HTMLDivElement 
        let input = document.getElementById(`comprobante_input_${index}`) as HTMLInputElement
        let close = document.getElementById(`comprobante_${index}_delete`) as HTMLButtonElement 
        close.classList.remove("hidden")

        let image = URL.createObjectURL(input.files![0])
        const preview = document.createElement('img');
        add(preview, ['size-full', 'absolute', 'top-[50%]',
        'left-[50%]', 'translate-y-[-50%]', 'translate-x-[-50%]',
        'animate-pop-delayed', 'origin-left'])

        preview.src = image;

        container.append(preview)
    }

    let images: number[] = $state([1])

    function deleteImage(index: number) {
        let label = document.getElementById(`comprobante_label_${index}`) as HTMLLabelElement 
        label.remove()
    }
</script>

{#snippet FileInput(index: number)}
    <label for="comprobante_input_{index}" class="animate-pop" id="comprobante_label_{index}">
        <div class="file-label" id="comprobante_container_{index}">

            <button type="button" id="comprobante_{index}_delete" onclick="{() => deleteImage(index)}"
            class="absolute z-50 top-1 right-1 hover:bg-error group rounded-md transition-all duration-200">
                <img class="filter group-hover:invert" src="{cancelar_icon}" alt="">
            </button>

            <img class="size-16" src="{copy_icon}" alt="">
            <p class="text-xs text-center">Haga click para elegir una imagen</p>
            <input class="hidden" 
                    id="comprobante_input_{index}" 
                    type="file" 
                    name="comprobante" 
                    accept="image/*"
                    oninput="{() => setImage(index)}"> 
        </div>
    </label> 
{/snippet}

<div class="size-full relative">
    <Alert form={ form } styles="absolute top-4 left-4 max-w-sm"/>
    <div class="h-fit w-full mb-4 relative flex items-center justify-between">
        <a href="{basePath}/justificaciones" class="btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
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

                <div class="w-3/5 h-full border border-base-content/30 rounded-md p-4 overflow-y-auto">
                    <div class="w-full h-[calc(100%-(0.75rem+0.5rem+1rem))]">
                        <div class="w-full bg-base-200 rounded-md p-4">
                            <div class="flex flex-col items-center justify-center relative">
                                <i class="text-xs absolute top-0 right-0">{new Date(justificacion.created_at).toLocaleDateString()}</i>

                                <button class="rounded-md
                                            px-4 py-1 group
                                            btn-sm
                                            btn btn-error btn-outline 
                                            w-fit 
                                            absolute top-0 left-0
                                            flex items-center justify-between" onclick="{() => { document.getElementById('delete_justificacion_modal').showModal() }}">
                                    <img src="{delete_icon}" alt="" class="red-filter group-hover:invert">
                                    <p class="group-hover:text-white">Eliminar</p>
                                </button> 

                                <i class="fa-regular fa-file-lines text-5xl"></i>
                                <b class="text-xl">Razon: Enfermedad</b>
                                <p class="text-xs">Tipo: {justificacion.tipo}</p>
                                <p>Estado: <b class="{vigencia === "Vigente" ? "text-success" : vigencia === "Expirado" ? "text-error" : "text-warning"}">{vigencia}</b> </p>                                   
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

                            <div class="w-full h-fit p-2 mt-2
                                    bg-base-200 rounded-md text-sm
                                    flex items-center justify-start gap-8">
                                <div>
                                    <b>Creado por:</b>
                                    {#if encargado}
                                        <p class="font-semibold text-medium">{encargado.nombre} {encargado.apellido} </p>
                                        <p>{encargado.usuario}</p>                                       
                                    {:else}
                                        <p>No registrado</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="divider p-0 m-0 mt-3"></div>

                            <div class="flex items-center justify-start gap-10 text-sm mt-4">
                                <div class="w-full">
                                    <b>Detalles</b>
                                    <p class="text-wrap w-full">{justificacion.detalles ? justificacion.detalles : "No se han especificado detalles para la justificación."}</p>
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
                             <div>
                                <b>Estado</b>
                                <p class="info-info {asignColor(justificacion.estado)} px-3 rounded-xl font-bold">{justificacion.estado} </p>
                            </div>  
                        </div>

                        <div class="pb-12"></div>
                    </div>
                </div>

                <div class="w-2/5 h-full border border-base-content/30 rounded-md p-2">
                    <input type="hidden" name="id_justificacion" value="{justificacion.id}">

                    <h3 class="font-semibold"> <i class="fa-solid fa-file-contract"></i> Comprobantes Físicos</h3>

                    <!-- <div class="flex w-full mt-2 justify-end">
                        <button class="btn bg-base-content text-base-100 gap-2 btn-sm">
                            <i class="fa-solid fa-file-arrow-up"></i>
                            <span>Agregar comprobantes</span>
                        </button>
                    </div> -->

                    <div class="w-full h-[calc(100%-(0.75rem+0.5rem+1.4rem))] mt-6">
                        <div class="w-full h-full 
                                bg-base-200 rounded-md 
                                p-2 
                                grid grid-cols-3 gap-3
                                overflow-y-scroll">
                            {#if comprobantes}
                                {#each comprobantes as comprobante, i(comprobante)}
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
                                        <img src="/downloads/000?path={comprobante.path}&type=comprobante" alt="" class="border border-base-content/30"> 
                                    </div>

                                    <!-- MODAL -->
                                    <dialog id="comprobante_{comprobante.id_comprobante}" class="modal modal- sm:modal-middle">
                                        <div class="modal-box relative
                                        bg-transparent shadow-none
                                        flex items-start justify-between gap-4 
                                        sm:w-10/12 sm:max-w-4xl h-[100%] overflow-hidden">

                                            <!-- <div class="button-container">
                                                <button aria-label="bu"><i class="fa-solid fa-circle-chevron-left"></i></button>
                                            </div> -->
                                            
                                            <div class="img-container h-full overflow-auto">
                                                <img src="/downloads/000?path={comprobante.path}&type=comprobante" alt="" class="border border-base-content/30"> 
                                            </div>

                                            <!-- <div class="button-container">
                                                <button aria-label="bu"><i class="fa-solid fa-circle-chevron-right"></i></button>
                                            </div> -->
                                        </div>

                                        <form method="dialog" class="modal-backdrop bg-black">
                                            <button>close</button>
                                        </form>
                                    </dialog>
                                {/each}
                            {/if}

                            <!-- {#each images as img, i(img)}
                                {@render FileInput(img)}                           
                            {/each}
                            
                            <button type="button" class="btn btn-lg btn-circle bg-base-content text-base-100"
                            onclick="{() => {images.push(images[images.length - 1] + 1)}}">
                                <span>+</span>
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<dialog id="delete_justificacion_modal" class="modal modal-bottom sm:modal-middle">
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

        <h3 class="text-lg mt-3 text-center">¿Seguro que desea eliminar este Justificativo?</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center leading-tight">Esta acción es irreversible; se eliminarán completamente todos los datos del justificativo, al igual que sus registros asociados como: comprobantes, fechas, imágenes</p>
        <p class="text-xs mt-2 text-base-content/70 text-wrap text-center leading-tight">En caso de ser una justificacion vigente, el estado del empleado será cambiado automaticamente en espera de asignacion.</p>

        <div class="w-fit gap-3 mt-4 flex">
            <form method="dialog">
                <button type="submit" class="btn btn-sm">Volver</button>
            </form>
            
            <form action="?/delete" method="POST" use:enhance>
                <input type="hidden" name="id_justificacion" value="{justificacion.id}">
                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

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
    .file-label {
        @apply relative
        flex flex-col items-center justify-center
        border-2 border-slate-600 rounded-md border-dashed
        shadow-md
        cursor-pointer p-2 gap-4
        transition-all duration-150 ease-in-out
        origin-left
        active:bg-base-300;
        --delay: 100ms;
    }

    .file-label:hover {
        @apply drop-shadow-2xl shadow-xl bg-base-content text-base-100
        border-0;

        img {
            @apply filter invert;
        }
    }
</style>