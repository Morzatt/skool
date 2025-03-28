<script lang="ts">
    import { enhance } from "$app/forms";
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import CreateIdModal from "./CreateIDModal.svelte";
    let { empleado, qr }: {empleado: any, qr: string} = $props()

    type Data = {
        title: string,
        value: string,
        name: string,
    }

    let infoPersonal: Data[] = $derived([
        {
            title: "Dirección de Habitación",
            value: "Urbanización Los Proceres, Manzana 17, Casa 12",
            name: 'direccion'
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
    let editPersonal = $state(false)

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

    let infoLaboral: Data[] = $derived([
        {
            title: "Departamento",
            value: empleado.nombre_departamento,
            name: 'departamento'
        },
        {
            title: "Cargo",
            value: empleado.cargo,
            name: 'cargo'
        },
        {
            title: "Fecha de Ingreso",
            value: '19/04/2024',
            name: 'fecha_ingreso'
        },
        {
            title: "Tiempo de Servicio",
            value: '11 Meses',
            name: 'tiempo_servicio'
        },
        {
            title: "Turno",
            value: empleado.turno,
            name: 'turno'
        },
        {
            title: "Hora de Entrada",
            value: '07:00 AM',
            name: 'hora_entrada'
        },
        {
            title: "Hora de Salida",
            value: '08:00 AM',
            name: 'hora_salida'
        },
    ])
    let editLaboral = $state(false)

    let infoMedica: Data[] = $derived([
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
    let editMedica = $state(false)
</script>

<!-- // CONTACTO, LABORAL, MEDICA -->
<div class="w-full min-h-80 flex flex-col-reverse lg:flex-row items-start justify-center gap-5 animate-pop-delayed">
    <div class="w-full lg:w-[75%] h-full *:my-4">
        <!-- PERSONAL -->
        <div class="w-full p-1 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-person"></i> Información Personal</h3> 
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editPersonal = !editPersonal}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <div class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                {#each infoPersonal as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editPersonal}
                                <input type="text" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
                                placeholder="{info.title}..."
                                value="{info.value}"
                                min="7"> 
                            {:else}
                                <p class="info-info">{info.value}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editPersonal}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </div>  
        </div>

        <!-- CONTACTO -->
        <div class="w-full p-2 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-phone"></i> Información De Contacto</h3>
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
                                <input type="text" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
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

        <!-- LABORAL -->
        <div class="w-full p-2 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-briefcase"></i> Información Laboral</h3>
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editLaboral = !editLaboral}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <div class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                {#each infoLaboral as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editLaboral}
                                <input type="text" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
                                placeholder="{info.title}..."
                                value="{info.value}"
                                min="7"> 
                            {:else}
                                <p class="info-info">{info.value}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editLaboral}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </div>  
        </div>

        <!-- MEDICO -->
        <div class="w-full p-2 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-kit-medical"></i> Información Médica</h3>
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editMedica = !editMedica}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <div class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                {#each infoMedica as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editMedica}
                                <input type="text" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
                                placeholder="{info.title}..."
                                value="{info.value}"
                                min="7"> 
                            {:else}
                                <p class="info-info">{info.value}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editMedica}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </div>  
        </div>
    </div>

    <div class="divider divider-horizontal m-0 p-0"></div>

    <div class="w-full lg:w-[25%] h-full
    text-center gap-2
    flex flex-col items-center justify-start">
        <div class="w-full h-8">
            <button class="btn bg-accent btn-sm" onclick="{() => {document.getElementById('create_ID_card').showModal()}}">Generar Identificación</button>
        </div>
        <div class="size-[15rem] animate-pop border-2 border-base-content rounded-xl p-1 bg-white">
            <img src="{qr}" alt="" class="size-full">
        </div>

        <h3 class="font-bold">Código QR del Empleado</h3>
    </div>
</div>

<div class="divider"></div>

<div class="w-full h-fit flex items-center justify-end animate-pop-delayed">
    <button class="rounded-md
                px-4 py-1 group
                btn btn-error btn-outline 
                w-fit 
                flex items-center justify-between" onclick="{() => { document.getElementById('delete_empleado_modal').showModal() }}">
        <img src="{delete_icon}" alt="" class="red-filter group-hover:invert">
        <p class="group-hover:text-white">Eliminar Cuenta</p>
    </button> 
</div>

<dialog id="delete_empleado_modal" class="modal modal-bottom sm:modal-middle">
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

        <h3 class="text-lg mt-3 text-center">¿Seguro que desea eliminar este Empleado?</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center leading-tight">Esta acción es irreversible; se eliminarán completamente todos los datos del empleado eliminado, al igual que sus registros asociados como: Datos Personales, Asistencias, Justificaciones, Reposos, etc...</p>

        <div class="w-fit gap-3 mt-4 flex">
            <form method="dialog">
                <button type="submit" class="btn btn-sm">Volver</button>
            </form>
            
            <form action="?/deleteEmpleado" method="POST" use:enhance>
                <input type="hidden" id="delete_account_close" name="cedula" value="{empleado.cedula}">
                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

<CreateIdModal empleado={ empleado } qr={qr}/>

<style lang="postcss">
    .animate-pop-delayed {
        --delay: 100ms
    }

    h3 {
        @apply font-bold text-lg mb-2;
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