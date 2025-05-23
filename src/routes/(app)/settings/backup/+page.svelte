<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { basePath, formatDateDDMMYY } from '$lib';
    import copy_icon from "$lib/images/icons/copy_icon.svg"
    import database_icon from "$lib/images/icons/database_icon.svg"
    import cancelar_icon from "$lib/images/icons/cancelar_icon.svg"


    import { enhance } from '$app/forms';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import { fly, slide } from 'svelte/transition';
    import { sineInOut } from 'svelte/easing';
    let { data, form }: { data: PageData, form: ActionData & { timestamp: string } } = $props();

    // Images Import

    // Assuming you have a file input element in your HTML
    let fileInput: any;
    
    type FileData = { fileName: string, fileSize: string | number, lastModified: string | Date | number }
    let fileData: FileData = $state({ fileName: ``, fileSize: ``, lastModified: `` })

    function bindInputData() {
        fileData.fileName = fileInput.files[0].name
        fileData.fileSize = `${(fileInput.files[0].size / 1000).toFixed(3)} KB`        
        fileData.lastModified = formatDateDDMMYY(fileInput.files[0].lastModifiedDate)
    } 

    function deleteFile() {
        // Convert the FileList to an array
        const filesArray = Array.from(fileInput.files);
        
        // Filter out the file at the specified index
        const filteredFiles = filesArray.filter((_, index) => index !== 0);
        
        // Create a new DataTransfer object and add the remaining files
        const dataTransfer = new DataTransfer();
        filteredFiles.forEach((file:any) => dataTransfer.items.add(file));
        
        // Update the input's files with the new FileList
        fileInput.files = dataTransfer.files;        
        fileData.fileName = ''
    }

    $effect(() => {
        if (form?.success && form?.form === "generate") {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = `/downloads/${form.timestamp}?type=backup`;
                link.download = `backup_${form.timestamp}.tar`; // Set the desired filename
                link.click();                
            }, 1000)
        }
    })
</script>

<div class="flex w-full flex-col lg:flex-row p-5 border border-base-content/40 rounded-xl relative">

    <Alert form={ form } styles="absolute left-4 top-4 max-w-sm"/>

  <div class="card bg-base-300 rounded-box grid flex-grow place-items-start p-4 w-full lg:w-2/4">
        <form class="w-full" method="POST" action="?/generate" use:enhance>
            <h2>Crear Copia de Seguridad</h2>
            <p class="mt-2">Realice un respaldo de toda la información almacenada en la aplicación. Esto incluye: usuarios, registros y configuraciones.</p>
            <button type="submit" class="btn btn-secondary mt-8 mr-4">Generar Respaldo</button>
        </form>
  </div>

  <div class="divider lg:divider-horizontal">O</div>

  <div class="card bg-base-300 rounded-box grid flex-grow place-items-start p-4 w-full lg:w-2/4">
    <form class="w-full" method="POST" action="?/upload" enctype="multipart/form-data" use:enhance>
        <div>
            <h2>Restaurar Copia de Seguridad</h2>
            <p class="mt-2">Al realizar una restauración de copia de seguridad, se perderán todos los datos actualmente 
            registrados, incluyendo usuarios y registros, y se reemplazarán por los almacenados en la copia <br>
            de seguridad.</p>
            <br>
            <p>Se recomienda realizar una copia de seguridad de los datos actuales para evitar perdidas permanentes de informacion.</p>
        </div>

        <div class="w-full lg:w-3/4 mt-8">
            <label for="fileInput">
                <img class="size-16" src="{copy_icon}" alt="">
                <h3 class=" font-bold">Haga click y seleccione el archivo de respaldo correspondiente.</h3>
                <input class="hidden" id="fileInput" type="file" oninput={bindInputData} name="backupUpload" bind:this={fileInput}> 
            </label>

            {#if fileData.fileName}
                <div class="w-[27rem]
                            mt-8 p-3
                            flex items-start justify-start 
                            border-2 border-slate-600 rounded-md
                            transition-all transform duration-300 origin-top animate-pop-delayed" style="--delay: 150ms" 
                            in:fly={{ duration: 100, easing: sineInOut, y: -200 }}
                            out:slide={{duration:200, easing: sineInOut, axis: "y"}}>
                    <img class="size-10 mt-2 mr-3 bg-slate-200 rounded-md" src="{database_icon}" alt="">
                    <div class="w-full overflow-hidden">
                        <p class=" font-bold text-md">Nombre: {fileData.fileName ? fileData.fileName : ""}</p>
                        <p class="text-sm">Tramaño: {fileData.fileSize ? fileData.fileSize : ""}</p>
                        <p>Ultima Modificación: {fileData.lastModified ? fileData.lastModified: ""}</p>
                    </div>
                    <button class=" size-fit group 
                                    flex items-center justify-center
                                    rounded-md transition-all duration-300 ease-linear
                                    hover:bg-red-600 active:bg-red-50"
                                    onclick={deleteFile} type="button">
                        <img class="w-8 filter group-hover:invert" src="{cancelar_icon}" alt="">
                    </button>
                </div>
            {/if}

        </div>

        <button type="submit" class="btn px-12 btn-primary mt-4">Restaurar</button>
    </form>
  </div>
</div>

<style lang="postcss">
    h2 {
        @apply text-xl mb-2 font-bold;
    }
    p {
        @apply text-sm;
    }
    
    label {
        @apply w-full h-[9rem] relative
        flex items-center justify-center
        border-2 border-slate-600 rounded-md border-dashed
        cursor-pointer p-3 gap-4;
    }
</style>