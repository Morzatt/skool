<script lang="ts">
    import { enhance } from "$app/forms";
    import copy_icon from "$lib/images/icons/copy_icon.svg"
    import cancelar_icon from "$lib/images/icons/cancelar_icon.svg"
    import Select from "../create/Select.svelte";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { ActionData } from "./$types";


    let { empleado, form }: {empleado: any, form: ActionData } = $props()

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

<dialog id="create_justificacion_modal" class="modal modal-ope modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-300 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-xl overflow-hidden">
        <Alert form={ form } styles="absolute left-2 top-2 max-w-sm"/>

        <form method="dialog">
            <button type="submit" id="create_justificacion_modal" aria-label="close-modal" 
            class="hover:text-error transition-all duration-200 ease-in-out absolute top-4 right-4">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <h3 class="text-xl font-bold mt-3 text-center">Crear Nueva Justificacion</h3>

        <form action="?/createJustificacion" method="post" enctype="multipart/form-data" use:enhance
                class="w-full mt-3 overflow-y-auto 
                flex flex-col gap-3 items-center justify-start">
            <input type="hidden" name="empleado" value="{empleado.cedula}">

            <!-- EMPLEADO, TIPO, DETALLES, FECHA INICIO, FECHA FINAL -->
            <div class="w-full border border-base-content/30 rounded-md mt-4 p-2">
                <h3 class="font-semibold"> <i class="fa-solid fa-clipboard"></i> Datos de Justificación</h3>

                <div class="w-full mt-3 flex flex-col items-start justify-between gap-3">
                    <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-5 flex-wrap">
                        <!-- TIPO -->
                        <label class="form-control max-w-[10rem]">
                            <div class="label">
                                <span class="label-text">Tipo</span>
                            </div>
                            <Select name="tipo" placeholder="Elegir" type="dropdown-bottom" styles="rounded-md" icon="fa-solid fa-notes-medical" options={[
                                {
                                    name: "Reposo",
                                    value: "Reposo"
                                },
                                {
                                    name: "Permiso",
                                    value: "Permiso"
                                },
                            ]}/>
                        </label> 

                        <!-- Fecha de Inicio -->
                        <label class="form-control max-w-[15rem]">
                            <div class="label">
                                <span class="label-text">Fecha de Inicio</span>
                            </div>
                            <input type="date" name="fecha_inicio" class="input input-sm focus:outline-0">
                        </label> 
                        <!-- Fecha de Finalizacion -->
                        <label class="form-control max-w-[15rem]">
                            <div class="label">
                                <span class="label-text">Fecha de Finalización</span>
                            </div>
                            <input type="date" name="fecha_finalizacion" class="input input-sm focus:outline-0">
                        </label> 
                    </div>

                    <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-5 flex-wrap">
                        <!-- DETALLES -->
                        <fieldset class="fieldset w-full mt-3">
                            <legend class="fieldset-legend font-bold text-sm mb-1">Detalles del Justificativo</legend>
                            <textarea class="textarea textarea-bordered w-full min-h-24" name="detalles" placeholder="Descripcion..."></textarea>
                        </fieldset>  
                    </div>
                </div>
            </div>

            <!-- COMPROBANTE Y CAMBIAR NOMBRE DE COMPROBANTE -->
            <div class="w-full border border-base-content/30 rounded-md mt-4 p-2">
                <h3 class="font-semibold"> <i class="fa-solid fa-note-sticky mx-2"></i>Comprobantes</h3>

                <div class="w-full mt-3 flex flex-col items-start justify-between gap-3">
                    <div class="w-full h-full bg-base-200 rounded-md p-2 grid grid-cols-3 gap-5 justify-center items-center">
                        {#each images as img, i(img)}
                            {@render FileInput(img)}                           
                        {/each}
                        
                        <button type="button" class="btn btn-lg btn-circle bg-base-content text-base-100"
                        onclick="{() => {images.push(images[images.length - 1] + 1)}}">
                            <span>+</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <button type="submit" class="btn btn-sm btn-success text-base-100 px-12">
                <span>Crear</span>
            </button>   
        </form>     
    </div>
</dialog>



<style lang="postcss">
    .file-label {
        @apply w-[10rem] min-h-[9rem] relative
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
    
    .form-control {
        @apply my-2;
    }
    .form-control .label { 
        @apply h-fit p-0 px-2 py-1;
    }
    .form-control .label .label-text {
        @apply font-bold;
    }

    .input {
        @apply input-bordered focus:outline-0 input-sm w-full;
    }
</style>