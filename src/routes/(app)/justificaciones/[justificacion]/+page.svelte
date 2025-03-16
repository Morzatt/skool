<script lang="ts">
    import { basePath } from '$lib';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import type { ActionData, PageData } from './$types';
    import Alert from '$lib/components/Messages/Alert.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { justificacion } = $derived(data)
</script>

<div class="size-full relative">
    <Alert form={ form } styles="absolute top-4 left-4 max-w-sm"/>

    <div class="h-8">
        <h3 class="font-bold text-xl">Registrar Entradas / Salidas</h3>
    </div>

    <div class="w-full mt-4 px-12 h-[calc(100%-(1rem+2rem))]">
        <div class="w-full h-full p-4
                    bg-base-100 rounded-md shadow-md border border-base-300
                     animate-pop">
            <div class="w-full h-full 
                flex items-center justify-center gap-3
                animate-pop-delayed" style="--delay: 150ms">

                <div class="w-2/5 h-full border border-base-content/30 rounded-md mt-4 p-2">
                    <h3 class="font-semibold"> <i class="fa-solid fa-file-contract"></i> Comprobantes Físicos</h3>

                    <div class="w-full mt-3">
                        <div class="w-full h-full bg-base-200 rounded-md p-2">
                            <div class="w-full">
                                <p class="text-sm">Configurar Cámara</p>
                                
                            </div>

                            <div class="w-full mt-2">
                                <p class="text-sm">Configurar Modo de Escaneo</p>
                                <label class="swap swap-flip
                                    p-1 
                                    transition-all duration-200 ease-in-out
                                    [&_i]:text-4xl">
                                    <!-- this hidden checkbox controls the state -->
                                    <input type="checkbox" id="type_checkbox"/>

                                    <!-- sun icon -->
                                    <div class="swap-off text-center text-sm">
                                        <i class="fa-solid fa-door-open"></i>
                                        <p>Entrada</p>
                                    </div>

                                    <div class="swap-on text-center text-sm">
                                        <i class="fa-solid fa-door-closed"></i>
                                        <p>Salida</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-3/5 h-full border border-base-content/30 rounded-md mt-4 p-4">
                    <h3 class="font-semibold"><i class="fa-solid fa-qrcode"></i> Escanear</h3>
                    
                    <div class="w-full h-full mt-3">
                        <div class="w-full h-3/4 
                                    bg-base-200 rounded-md 
                                    border border-base-content/30
                                    px-2 relative
                                    flex items-center justify-center">
                            <i class="fa-solid fa-expand absolute text-9xl animate-pop-delayed" style="--delay: 250ms"></i>
                            <video id="qr-scanner" class="size-full rounded-md">
                                <track kind="captions"/>
                            </video>
                        </div>

                        <div class="w-full h-fit mt-2 
                        flex items-center justify-around">
                            <button class="control-button btn"
                            aria-label="control-button">
                                <i class="fa-solid fa-bolt"></i>
                            </button>
                            <button class="control-button btn" aria-label="control-button">
                                <i class="fa-solid fa-play"></i>
                            </button>
                            <button class="control-button btn" aria-label="control-button">
                                <i class="fa-solid fa-square"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<style lang="postcss">
    .control-button {
        @apply bg-base-content text-base-100;
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