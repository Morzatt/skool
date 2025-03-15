<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import QrScanner from 'qr-scanner';
    import FilterSelect from '../empleados/FilterSelect.svelte';

    let { data }: { data: PageData } = $props();
    
    let time = $state(new Date())

    setInterval(() => {
        time = new Date()
    }, 1000);

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

    async function requestAsistencia(result: QrScanner.ScanResult) {
        let response = await fetch(`/asistencias/entrada`, { 
            method: "POST",
            body: JSON.stringify({
                ...result
            })
        })

        if (response.ok) {
            qrScanner.stop()
            let data = await response.json()
        }
    }

    let load = $state(true)
    onMount(() => {
        videoElem = document.getElementById('qr-scanner') as HTMLVideoElement
        qrScanner = new QrScanner(
            videoElem,
            result => { requestAsistencia(result) },
            {
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );
        load = true;
    })
    type Content = 'entrada' | 'salida';
    let content: Content = $state('entrada');
</script>

<div class="size-full">
    <div class="h-12">
        <h3 class="font-bold text-xl">Registrar Entradas / Salidas</h3>
    </div>


    <div class="w-full flex items-end justify-between">
        <!-- Configurar Camara -->
        <div class="w-fit bg-base-300 animate-pop rounded-md p-2">
            <h3 class="text-lg font-semibold">Configurar Escáner</h3>

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
        
        </div>

        <div class="form-control w-fit h-max animate-pop">
            <div class="label p-0 m-0">
                <b class="label-text">Fecha</b>
            </div>
            <div class="w-fit min-w-72 h-28
            flex items-center justify-start 
            border-2 border-base-content rounded-md 
            font-bold text-3xl">
                <div class="bg-base-100 border-r-2 border-base-content
                    w-2/4 h-full
                    rounded-md rounded-r-none
                    flex flex-col items-center justify-center">
                    <p>{time.getDate()}</p>
                    <p class="text-sm">{time.toLocaleDateString("esp", { weekday: "long" })}</p>
                </div>
                <div class="bg-error
                    w-2/4 h-full
                    rounded-md rounded-l-none 
                    flex flex-col items-center justify-center
                    text-white">
                    <p>{time.toLocaleDateString("esp", { month:"2-digit" })}</p>
                    <p class="text-sm">{time.toLocaleDateString("esp", { month: "long" })}</p>
                </div>
            </div>
        </div>

        <div class="form-control w-fit h-full p-2 bg-base-content text-base-100 rounded-md animate-pop">
            <div class="label p-0 m-0">
                <b class="label-text text-base-100">Hora Actual</b>
            </div>
            <div class="text-5xl font-bold font-sans">{time.toLocaleTimeString("esp", { hour12: true })}</div>
        </div> 
    </div>

    <div class="w-full h-fit mt-5 animate-pop bb">
        <div class="w-1/3 min-h-[20rem]">
            <div class="form-control p-0 m-0 mb-4">
                <div class="label">
                    <div class="label-text">Cambiar Modo</div>
                </div>
                <div class="flex items-center justify-between gap-4">
                    <button onclick="{() => {content = "entrada"}}" 
                            class="button-content {content === "entrada" ? "content-active" : ""}">Registrar Entrada</button>

                    <button onclick="{() => {content = "salida"}}" 
                            class="button-content {content === "salida" ? "content-active" : ""}">Registrar Salida</button>
                </div>
            </div>

            <div class="mockup-window border border-base-content/50 w-full">
                <div class="size-full p-0 bg-black border-t border-base-content/50 h-80">
                    <video id="qr-scanner" class="size-full">
                        <track kind="captions"/>
                    </video>
                </div>
            </div>
        </div>

        <button class="btn" onclick="{() => qrScanner.start()}">Escanear</button>
    </div>
</div>

<style lang="postcss">
    .button-content {
        @apply relative transition-all duration-200 ease-in-out px-2 py-1;
    }
    .button-content:active {
        @apply scale-75;
    }

    .button-content::after {
        content: "";
        @apply scale-0 absolute bottom-[-0.1rem] left-0 bg-base-content h-[2px] w-full origin-top duration-200;
    }
    .content-active::after {
        @apply scale-100;
    }

    .content-active {
        @apply bg-base-300 px-2 py-1 rounded-md;
    }
</style>