<script lang="ts">
    let { empleado, qr }: {empleado: any, qr: string} = $props()

    type Data = {
        title: string,
        value: string,
        name: string,
    }

    let infoContacto: Data[] = $derived([
        {
            title: "Teléfono Personal",
            value: '0416-1028853',
            name: 'telefono_personal'
        },
        {
            title: "Teléfono de Habitación",
            value: '0285-12839953',
            name: 'telefono_hogar'
        },
        {
            title: "Correo Electrónico",
            value: 'carlosrafa@gmail.com',
            name: 'correo_electronico'
        },
    ])
    let editContacto = $state(false)
</script>

<!-- // CONTACTO, LABORAL, MEDICA -->
<div class="w-full h-80 flex items-center justify-center gap-2 *: *:h-full">
    <div class="w-[75%] h-full *:my-2">
        <!-- PERSONAL -->
        <div class="w-full p-1 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3>Información Personal</h3>
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button">
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <div class="lg:w-2/4 h-full flex items-start justify-start flex-col flex-wrap gap-2">
                <div class="info">
                    <h3 class="info-title">aja</h3>
                    <p class="info-info">{"Resul"}</p>
                </div>  
            </div>  
        </div>

        <div class="w-full p-1 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3>Información De Contacto</h3>
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editContacto = !editContacto}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <div class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                {#each infoContacto as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editContacto}
                                <input type="text" class="input input-bordered input-sm focus:outline-0 bg-base-100/70"
                                placeholder="{info.title}..."
                                value="{info.value}"
                                min="7"> 
                            {:else}
                                <p class="info-info">{info.value}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editContacto}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </div>  
        </div>
    </div>

    <div class="divider divider-horizontal"></div>

    <div class="w-[25%] h-full
    text-center gap-2
    flex flex-col items-center justify-start">
        <div class="w-full h-8">
            <button class="btn bg-accent btn-sm">Generar Identificación</button>
        </div>
        <div class="size-[15rem] border-2 border-base-content rounded-xl p-1 bg-white">
            <img src="{qr}" alt="" class="size-full">
        </div>

        <h3 class="font-bold">Código QR del Empleado</h3>
    </div>
</div>

<style lang="postcss">
    h3 {
        @apply font-bold text-lg;
    }
    .info {
        @apply w-fit;
        .info-title {
            @apply font-bold text-base-content/90 text-sm;
        }
        .info-info {
            @apply text-sm;
        }
    }
</style>