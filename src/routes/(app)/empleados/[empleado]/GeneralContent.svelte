<script lang="ts">
    import { enhance } from "$app/forms";
    import type { Departamento, InfoContacto, InfoLaboral, InfoPersonal } from "$lib/database/types";
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import Select from "../create/Select.svelte";
    import CreateIdModal from "./CreateIDModal.svelte";
    let { empleado, qr, personal, contacto, laboral, departamentos }: { empleado: any, qr: string,
    personal: InfoPersonal | undefined, contacto: InfoContacto| undefined, laboral: InfoLaboral | undefined, 
    departamentos: Departamento[] | undefined } = $props()

    type Data = {
        title: string,
        value: string | undefined,
        name: string,
        update?: boolean,
        type?: 'date' | 'time' | "select" | 'number' | 'text',
        options?:  { name: string, value: string }[]
    }

    let infoPersonal: Data[] = $derived([
        {
            title: "Estado Civil",
            value: personal?.estado_civil,
            name: 'estado_civil',
            type: "select",
            options: [
                {
                    name: "Soltero(a)",
                    value: "Soltero(a)"
                },
                {
                    name: "Casado(a)",
                    value: "Casado(a)"
                },
                {
                    name: "Divorciado(a)",
                    value: "Divorciado(a)"
                },
                {
                    name: "Viudo(a)",
                    value: "Viudo(a)"
                },
            ],
            update: true 
        },
        {
            title: "Nivel Académico",
            value: personal?.nivel_academico,
            name: 'nivel_academico'
        },
    ])
    let editPersonal = $state(false)

    let infoContacto: Data[] = $derived([
        {
            title: "Teléfono Personal",
            value: contacto?.telefono_personal,
            type: "number",
            name: 'telefono_personal'
        },
        {
            title: "Teléfono de Habitación",
            value: contacto?.telefono_habitacion,
            type: "number",
            name: 'telefono_habitacion'
        },
        {
            title: "Correo Electrónico",
            value: contacto?.correo_electronico,
            name: 'correo_electronico'
        },
        {
            title: "Direccion de Habitacion",
            value: contacto?.direccion_habitacion,
            name: 'direccion_habitacion'
        },
    ])
    let editContacto = $state(false)

    let infoLaboral: Data[] = $derived([
        {
            title: "Departamento",
            value: empleado.nombre_departamento,
            name: 'departamento',
            update: true,
            type: "select",
            options: departamentos?.map(d => {
                return {
                    name: d.nombre_departamento,
                    value: d.id_departamento 
                }
            })
        },
        {
            title: "Cargo",
            value: empleado.cargo,
            name: 'cargo',
            update: true
        },
        {
            title: "Fecha de Ingreso",
            value: laboral?.fecha_ingreso ? new Date(laboral.fecha_ingreso).toLocaleDateString('es') : "",
            name: 'fecha_ingreso',
            update: false
        },
        {
            title: "Tiempo de Servicio",
            value: laboral?.tiempo_servicio,
            name: 'tiempo_servicio',
            update: false
        },
        {
            title: "Turno",
            value: empleado.turno,
            name: 'turno',
            type: "select",
            options: [
                {
                    name: "Mañana",
                    value: "Mañana"
                },
                {
                    name: "Tarde",
                    value: "Tarde"
                },
            ],
            update: true 
        },
        {
            title: "Hora de Entrada",
            value: laboral?.hora_entrada ?
                    new Date(1995,1,1,
                    parseInt(laboral.hora_entrada.slice(0, laboral.hora_entrada.lastIndexOf(':'))),
                    parseInt(laboral.hora_entrada.slice(laboral.hora_entrada.lastIndexOf(':')+1))
                    ).toLocaleTimeString("ve", { hour12: true, hour: "2-digit", minute: "2-digit" }) 
            : "",
            name: 'hora_entrada',
            type: "time",
            update: true
        },
        {
            title: "Hora de Salida",
            value: laboral?.hora_salida ? 
                    new Date(1995,1,1,
                    parseInt(laboral.hora_salida.slice(0, laboral.hora_salida.lastIndexOf(':'))),
                    parseInt(laboral.hora_salida.slice(laboral.hora_salida.lastIndexOf(':')+1))
                    ).toLocaleTimeString("ve", { hour12: true, hour: "2-digit", minute: "2-digit" }) 
                : "",
            name: 'hora_salida',
            update: true,
            type: "time"
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
    function closeSection(id: string) {
        document.getElementById(id).click()
    }
</script>

<!-- // CONTACTO, LABORAL, MEDICA -->
<div class="w-full min-h-80 flex flex-col-reverse lg:flex-row items-start justify-center gap-5 animate-pop-delayed">
    <div class="w-full lg:w-[75%] h-full *:my-4">
        <!-- PERSONAL -->
        <div class="w-full p-1 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-person"></i> Información Personal</h3> 
                <button id='personal_close' class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editPersonal = !editPersonal}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <form action='?/personal' method="POST" use:enhance={ () => closeSection('personal_close') } class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                <input type="hidden" value={empleado.cedula} name="id_empleado">
                {#each infoPersonal as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editPersonal}
                            {#if info.type !== "select"}
                                <input type="text" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
                                placeholder="{info.title}..."
                                name={info.name}
                                value="{info.value}"
                                min="7">                              
                            {:else}
                                {#if info.options}
                                    <Select name={info.name} placeholder='Elegir' options={
                                        info.options.map(i => {
                                            return {
                                                name: i.name,
                                                value: i.value  
                                            }
                                        })
                                    }/>
                                {/if}
                            {/if}
                        {:else}
                            <p class="info-info {info.value ? "" : "text-error"}">{info.value ? info.value : "Sin Especificar"}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editPersonal}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </form>  
        </div>

        <!-- CONTACTO -->
        <div class="w-full p-2 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-phone"></i> Información De Contacto</h3>
                <button id="contacto_close" class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editContacto = !editContacto}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <form method="POST" action="?/contacto" use:enhance={ () => closeSection('contacto_close') } class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                <input type="hidden" value={empleado.cedula} name="id_empleado">
                {#each infoContacto as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editContacto}
                                <input type="{info.type !== 'text' ? info.type : 'text'}" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
                                placeholder="{info.title}..."
                                value="{info.value}"
                                name={info.name}
                                min="7"> 
                            {:else}
                                <p class="info-info {info.value ? "" : "text-error"}">{info.value ? info.value : "Sin Especificar"}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editContacto}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </form>  
        </div>

        <!-- LABORAL -->
        <div class="w-full p-2 px-4 border border-base-content/40 rounded-md">
            <div class="w-full flex items-center justify-between">
                <h3><i class="fa-solid fa-briefcase"></i> Información Laboral</h3>
                <button id="laboral_close" class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick={()=>{editLaboral = !editLaboral}}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>

            <form method="POST" action="?/laboral" use:enhance={ () => closeSection('laboral_close') } class="lg:w-full h-full flex items-start justify-start flex-wrap gap-4">
                <input type="hidden" value={empleado.cedula} name="id_empleado">
                {#each infoLaboral as info}
                    <div class="info">
                        <h3 class="info-title">{info.title}</h3>
                        {#if editLaboral && info.update}
                                {#if info.type !== "select"}
                                    <input type="{info.type ? info.type : "text"}" class="input input-bordered input-sm focus:outline-0 bg-base-100/70 animate-pop"
                                    placeholder="{info.title}..."
                                    value="{info.value}"
                                    name={info.name}
                                    min="7">                                    
                                {:else}
                                    {#if info.options}
                                        <Select name={info.name} placeholder={info.name === "turno" ? empleado.turno : empleado.nombre_departamento ? empleado.nombre_departamento : "Elegir"} options={
                                            info.options.map(i => {
                                                return {
                                                    name: i.name,
                                                    value: i.value  
                                                }
                                            })
                                        }/>
                                    {/if}
                                {/if}

                            {:else}
                                <p class="info-info {info.value ? "" : "text-error"}">{info.value ? info.value : "Sin Especificar"}</p>   
                        {/if}
                    </div>                     
                {/each}

                {#if editLaboral}
                    <div class="w-full flex items-center justify-end">
                        <button class="btn btn-md bg-base-content text-base-100">Aceptar</button>
                    </div>
                {/if}
            </form>  
        </div>

        <!-- MEDICO -->
        <!-- <div class="w-full p-2 px-4 border border-base-content/40 rounded-md">
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
        </div> -->
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