<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { onMount } from 'svelte';
    import QrScanner from 'qr-scanner';
    import AsistenciaPreview from './AsistenciaPreview.svelte';
    import type { Departamento, Empleado, Usuario } from '$lib/database/types';
    import { FormResponse } from '$lib/classes/responses.classes';
    import Alert from '$lib/components/Messages/Alert.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    
    let videoElem: HTMLVideoElement;
    let qrScanner: QrScanner;
    let camera: { id: string, label: string } = $state({
        id: "",
        label: ""
    });

    function setCamera(cam: QrScanner.Camera) {
        camera = cam; 
        qrScanner.setCamera(cam.id);
        setTimeout(() => {
            document.getElementById('camera_dropdown')?.attributes.removeNamedItem('open')
        }, 100)
    }

    let empleado: Empleado & Departamento | null = $state(null)
    let date: Date | null = $state(null)
    let type: 'entrada' | 'salida' = $state('entrada')

    async function requestEmpleadoData(result: QrScanner.ScanResult) {
        let response = await fetch(`/asistencias/registrar`, { 
            method: "POST",
            body: JSON.stringify({
                ...result
            })
        })
        if (!response.ok) {
            form = new FormResponse('getEmpleado').error('Ocurrió un error al procesar la solicitud.')  
            return
        }
        qrScanner.stop()
        let data = await response.json()
        if (!data.success) {
            form = new FormResponse('getEmpleado').error(data.message)
            return
        }
        empleado = data.empleado
        date = new Date()
        let type_checkbox = document.getElementById('type_checkbox') as HTMLInputElement
        type_checkbox.checked ? type = "salida" : type = "entrada";

        let modal = document.getElementById('asistencia_modal') as HTMLElement & { showModal: () => any }
        modal.showModal()!
    }

    let load = $state(true)
    onMount(() => {
        videoElem = document.getElementById('qr-scanner') as HTMLVideoElement
        qrScanner = new QrScanner(
            videoElem,
            result => { requestEmpleadoData(result) },
            {
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );
        load = true;
    })
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
            <div class="w-full h-7 flex items-center justify-between">
                <h1 class="text-xl font-bold"><i class="fa-solid fa-helmet-safety"></i> Registrar Asistencia</h1>
            </div>

            <div class="w-full h-[calc(100%-(2rem))] 
                flex items-center justify-center gap-3
                animate-pop-delayed" style="--delay: 150ms">

                <div class="w-2/5 h-full border border-base-content/30 rounded-md mt-4 p-2">
                    <h3 class="font-semibold"> <i class="fa-solid fa-barcode"></i> Configurar Escáner</h3>

                    <div class="w-full mt-3">
                        <div class="w-full h-full bg-base-200 rounded-md p-2">
                            <div class="w-full">
                                <p class="text-sm">Configurar Cámara</p>
                                {#if load}
                                    {#await QrScanner.listCameras() then cameras}
                                        <details class="dropdown dropdown-bottom" id="camera_dropdown">
                                            <summary class="btn btn-sm bg-base-content text-base-100 m-1 px-5">
                                                <i class="fa-solid fa-camera"></i>
                                                <span>{camera.label ? camera.label : "Seleccionar Camara"}</span>
                                            </summary>

                                            <ul class="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
                                                {#each cameras as camera, i}
                                                    <li>
                                                        <button onclick="{() => { setCamera(camera) }}">
                                                            <span>{camera.label}</span>
                                                        </button>
                                                    </li> 
                                                {/each}
                                            </ul>
                                        </details>
                                    {/await}
                                {/if}
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
                            <button class="control-button btn" onclick="{() => {
                                return;
                                QrScanner
                                .scanImage(data.qr, {returnDetailedScanResult: true})
                                .then(data => requestEmpleadoData(data))}}"
                            aria-label="control-button">
                                <i class="fa-solid fa-bolt"></i>
                            </button>
                            <button class="control-button btn" onclick="{() => qrScanner.start()}" aria-label="control-button">
                                <i class="fa-solid fa-play"></i>
                            </button>
                            <button class="control-button btn" onclick="{() => qrScanner.stop()}" aria-label="control-button">
                                <i class="fa-solid fa-square"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<AsistenciaPreview form={ form } bind:empleado={ empleado } usuario={ data.usuario } bind:date={date} type={ type }/>

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