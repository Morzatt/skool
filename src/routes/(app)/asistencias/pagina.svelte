<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    import QrScanner from 'qr-scanner';

    let videoElem: HTMLVideoElement;
    let qrScanner: QrScanner;

    let cameraID: string;

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

        // QrScanner.listCameras(true).then(data => console.log(data))
        // qrScanner.setCamera('853e5a31e04eeb2acbfa86f9200a4a6e937035d65fe2d3ad026a3c80f3e8d062')
        load = true;
    })

    function scan() {
        QrScanner.scanImage(data.qr, {
            returnDetailedScanResult: true
        })
        .then(result => console.log(result.data))
        .catch(error => console.log(error || 'No QR code found.'));
    }
</script>

<div class="bb size-full">
    <div class="bb w-2/4 h-[20rem]">
        <video id="qr-scanner" class="size-full"></video>
    </div>

    <button class="btn" onclick="{() => qrScanner.start()}">Escanear</button>
    <button class="btn bg-base-content text-base-100" onclick="{scan}">Escanear Foto</button>

    <div class="bb w-full">
        {#if load}
            {#await QrScanner.listCameras() then cameras}
                {#each cameras as camera}
                    <p>{camera.label}</p>    
                    <p>{camera.id}</p>    
                    <div class="divider"></div>
                {/each}                
            {/await}
        {/if}
    </div>
</div>