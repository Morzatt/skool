<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    import QrScanner from 'qr-scanner'; // if installed via package and bundling with a module bundler like webpack or rollup
    import QRCode from "qrcode"

    let videoElem: HTMLVideoElement;
    let qrScanner: QrScanner;

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
        // console.log(QrScanner.listCameras(true).then(data => console.log(data)))
        // qrScanner.setCamera('853e5a31e04eeb2acbfa86f9200a4a6e937035d65fe2d3ad026a3c80f3e8d062')
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
    <img src="{data.qr}" alt="" class="size-[20rem]">
</div>