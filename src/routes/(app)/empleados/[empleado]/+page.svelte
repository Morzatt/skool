<script lang="ts">
    import { basePath, formatStringWithDots } from '$lib';
    import type { ActionData, PageData } from './$types';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import Alert from '$lib/components/Messages/Alert.svelte';
    import GeneralContent from './GeneralContent.svelte';
    import JustificacionesContent from './JustificacionesContent.svelte';
    import AsistenciasContent from './AsistenciasContent.svelte';
    import type { EstadosEmpleado } from '$lib/database/types';
    import { enhance } from '$app/forms';
    import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
    import { downloadFile } from '$lib/utils/downloadFile';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { empleado, laboral, contacto, personal, departamentos, usuario } = $derived(data)

    type Data = {
        title: string, value: string, icon?: string
    }

    let personalInfo: Data[] = $derived([
        {
            title: "Fecha de Nacimiento",
            value: new Date(empleado.fecha_nacimiento).toLocaleDateString()
        },
        {
            title: "Edad",
            value: `${empleado.edad} Años`
        },
        {
            title: "Sexo",
            value: empleado.sexo
        },
        {
            title: "Turno",
            value: empleado.turno
        },
        {
            title: "Estado",
            value: empleado.estado
        }
    ])

    type Content = 'General' | 'Asistencias' | 'Justificaciones';
    let content: Content = $state('General');

    function asignColor(status: EstadosEmpleado): string {
        switch (status) {
            case "Activo": 
                return "text-green-900 bg-success/50"
            case "Inhabilitado":
                return "text-error-content/50 bg-error/50"
            default: 
                return "text-yellow-900 bg-warning/50"
        }
    }

    $effect(() => {
        if (form && form.form === "createJustificacion" && form.success) {
            document.getElementById('create_justificacion_close')?.click()
        }

        if (form && form.form === "downloadID" && form.success) {
            downloadFile(`/downloads/${form.id}?type=card`, `ID_${empleado.cedula}.png`)
        }

        if (form && form.form === "printEmpleado" && form.success) {
            downloadFile(`/downloads/${form.fileId}?type=empleado`, `empleado_${empleado.cedula}.pdf`)
        }
    })

    $inspect(form)
</script>

<div class="relative">
    <Alert form={form} styles="fixed top-12 left-12 max-w-sm"/>
    <div class="h-fit w-full mb-4 relative flex items-center justify-between">
        <a href="{basePath}/empleados" class="btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
        data-tip="Administrar Empleados">
            <img src="{chevron}" alt="">
        </a>

        <h3 class="text-3xl font-bold">Empleado</h3>
    </div>

    <div class="h-12 w-full
        my-4 mb-8 px-4 py-1
        rounded-xl">
        <div class="form-control p-0 m-0">
            <div class="label">
                <b class="label-text">Cambiar Contenido</b>
            </div>
            <div class="flex items-center justify-start gap-4">
                <button onclick="{() => {content = "General"}}" 
                        class="button-content {content === "General" ? "content-active" : ""}">General</button>

                <button onclick="{() => {content = "Justificaciones"}}" 
                        class="button-content {content === "Justificaciones" ? "content-active" : ""}">Justificaciones</button>

                <button onclick="{() => {content = "Asistencias"}}" 
                        class="button-content {content === "Asistencias" ? "content-active" : ""}">Asistencias</button>
            </div>
        </div>
    </div>

    <div class="bg-base-300 min-h-44 animate-pop rounded-xl p-3
                flex flex-col lg:flex-row gap-2
                relative">
        <!-- INFO -->
        <div class="lg:w-2/4 h-full flex items-center justify-start">
            <!-- PROFILE PIC -->
            <div class="w-1/3 h-full flex items-center justify-center">
                <i class="fa-solid fa-user text-9xl"></i>
            </div>
            <!-- NOMBRE, CARGO, CONTACTO -->
            <div class="w-2/3 h-full p-1">
                <!-- NOMBRE -->
                <h3 class="text-xl font-bold">{capitalizeFirstLetter(empleado.primer_nombre)} {capitalizeFirstLetter(empleado.segundo_nombre)} {capitalizeFirstLetter(empleado.primer_apellido)} {capitalizeFirstLetter(empleado.segundo_apellido)}</h3>
                <!-- CEDULA - DEPARTAMENTO - CARGO -->
                <div>
                    <p class="text-sm mb-2">{`${empleado.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(empleado.cedula)}`}</p>
                    <p class="text-sm"><b>Departamento:</b> {empleado.nombre_departamento ? empleado.nombre_departamento : "Sin Departamento"}</p>
                    <p><b>Cargo:</b> <i>{empleado.cargo}</i></p>
                </div>

                <!-- BOTONERA -->
                <div class="mt-3 h-8 w-full flex items-center justify-start gap-3">
                    <!-- <button aria-label="action-button" data-tip=""
                    class="action-button btn btn-sm">
                        <i class="fa-solid fa-heart"></i>
                    </button>  -->
                    <form action="?/printEmpleado" method="post" use:enhance>
                        <input type="hidden" name="cedula" value="{empleado.cedula}">
                        <button aria-label="action-button" data-tip="Imprimir Planilla del Empleado"
                        class="action-button btn btn-sm">
                            <i class="fa-solid fa-print"></i>
                        </button> 
                    </form>
                </div>
            </div>
        </div>

        <div class="divider divider-horizontal"></div>

        <div class="lg:w-2/4 max-h-44 flex items-start justify-start flex-col flex-wrap gap-2">
            {#each personalInfo as info, i(info)}
                    {#if info.title === "Estado"}
                        <div class="flex gap-4 animate-pop">
                            <div class="info">
                                <h3 class="info-title mb-1">{info.title}</h3>
                                <p class="info-info {asignColor(info.value)} px-3 rounded-xl font-bold">{info.value}</p>
                            </div>

                            <div class="info {empleado.estado !== "Activo" ? "" : "hidden"}">
                                <h3 class="info-title">Activar</h3>
                                <form action="?/activar" method="post" use:enhance>
                                    <input type="hidden" name="cedula" value="{empleado.cedula}">
                                    <button data-tip="Activar Empleado"
                                    class="tooltip tooltip-top btn btn-sm bg-transparent hover:text-success/50 text-success btn-circle flex items-center justify-center text-center" aria-label="button">
                                        <i class="fa-solid fa-circle-check text-3xl"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    {:else}
                        <div class="info">
                            <h3 class="info-title">{info.title}</h3>
                            <p class="info-info">{info.value}</p>
                        </div>                 
                    {/if}

            {/each}
        </div>

        <button class="rounded-md
                    px-4 py-1 group
                    btn btn-error btn-sm 
                    text-base-100
                    w-fit 
                    flex items-center justify-between
                    absolute right-2 bottom-2
                    {empleado.estado == 'Despedido' || empleado.estado == "Inhabilitado" ? "hidden" : ""}" 
        onclick="{() => { document.getElementById('retirar_empleado_modal').showModal() }}">
            <p class="group-hover:text-white">Inhabilitar</p>
        </button> 
    </div> 

    <div class="h-10 my-4 w-full rounded-xl bg-base-00 px-4 py-1 border-0 border-base-content">
        <h3 class="text-xl font-semibold animate-x">{content}</h3>
    </div>

    <div class="min-h-40 my-4 w-full rounded-xl bg-base-300 p-2 lg:p-4">
        {#if content === "General"}
            <GeneralContent empleado={ empleado } qr={data.qr} personal={personal} contacto={contacto} laboral={laboral} departamentos={departamentos}/>
        {:else if content === "Justificaciones"} 
            <JustificacionesContent encargado={{nombre: `${usuario.nombre} ${usuario.apellido}`, id: usuario.usuario}} empleado={ empleado } justificaciones={ data.justificaciones } form={ form }/>
        {:else if content === "Asistencias"}
            <AsistenciasContent empleado={ empleado } asistencias={ data.asistencias || [] }/>
        {/if}
    </div>
</div>

<dialog id="retirar_empleado_modal" class="modal modal-bottom sm:modal-middle">
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

        <h3 class="text-lg mt-3 text-center">¿Seguro que desea retirar este Empleado?</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center leading-tight">Una vez retirado, el empleado no podrá registrar asistencias, justificaciones, ni ningún tipo de proceso dentro de la aplicación.</p>

        <div class="w-fit gap-3 mt-4 flex">
            <form method="dialog">
                <button id="retiro_close" type="submit" class="btn btn-sm">Volver</button>
            </form>
            
            <form action="?/retirar" method="POST" use:enhance={()=>{ document.getElementById('retiro_close').click() }}>
                <input type="hidden" id="delete_account_close" name="cedula" value="{empleado.cedula}">
                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Retirar</button>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .button-content {
        @apply relative transition-all duration-200 ease-in-out;
    }
    .button-content::after {
        content: "";
        @apply scale-0 absolute bottom-[-0.1rem] left-0 bg-base-content h-[2px] w-full origin-top duration-200;
    }
    .content-active::after {
        @apply scale-100;
    }

    .info {
        @apply w-fit;
        .info-title {
            @apply font-bold text-base-content/70 text-sm;
        }
        .info-info {
            @apply text-sm;
        }
    }

    .action-button {
        @apply bg-base-content text-base-100 btn-circle
        flex items-center justify-center
        tooltip tooltip-top tooltip-secondary;
    }
</style>