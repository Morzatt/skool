<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    import QrScanner from 'qr-scanner'; // if installed via package and bundling with a module bundler like webpack or rollup

    let videoElem: HTMLVideoElement;
    let qrScanner: QrScanner;

    async function requestAsistencia(result: QrScanner.ScanResult) {
        let response = await fetch(`/asistencias`, { 
            method: "POST",
            body: JSON.stringify({
                ...result
            })
        })
        let data = await response.json()
        console.log(data)

        qrScanner.stop()
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
    })
</script>

<div class="bb size-full">
    <video id="qr-scanner"></video>

    <button class="btn" onclick="{() => qrScanner.start()}">Escanear</button>
</div>