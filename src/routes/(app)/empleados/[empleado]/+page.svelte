<script lang="ts">
    import { basePath } from '$lib';
    import type { PageData } from './$types';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import GeneralContent from './GeneralContent.svelte';
    import JustificacionesContent from './JustificacionesContent.svelte';
    import AsistenciasContent from './AsistenciasContent.svelte';
    import type { EstadosEmpleado } from '$lib/database/types';

    let { data }: { data: PageData } = $props();
    let { empleado } = $derived(data)

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
            value: empleado.edad
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

    function asignColor(status: string): string {
        switch (status) {
            case "Activo": 
                return "text-green-900 bg-success/50"
            case "Inhabilitado":
                return "text-base-200 bg-error/50"
            case "Despedido":
                return "text-red-900 bg-error/50"
            default: 
                return "text-yellow-900 bg-warning/50"
        }
    }
</script>

<div class="">
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
                <div class="label-text">Cambiar Contenido</div>
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

    <div class="bg-base-300 min-h-40 h-44 rounded-xl p-3
                flex flex-col lg:flex-row gap-2
                ">
        <!-- INFO -->
        <div class="lg:w-2/4 h-full flex items-center justify-start">
            <!-- PROFILE PIC -->
            <div class="w-1/3 h-full flex items-center justify-center">
                <i class="fa-solid fa-user text-9xl"></i>
            </div>
            <!-- NOMBRE, CARGO, CONTACTO -->
            <div class="w-2/3 h-full p-1">
                <!-- NOMBRE -->
                <h3 class="text-xl font-bold">{empleado.primer_nombre} {empleado.segundo_nombre} {empleado.primer_apellido} {empleado.segundo_apellido}</h3>
                <!-- CEDULA - DEPARTAMENTO - CARGO -->
                <div>
                    <p class="text-sm mb-2">{`${!empleado.nacionalidad ? "V-" : empleado.nacionalidad == "Venezolano" ? "V-" : "E-"}${empleado.cedula}`}</p>
                    <p class="text-sm"><b>Departamento:</b> {empleado.nombre_departamento}</p>
                    <p><b>Cargo:</b> <i>{empleado.cargo}</i></p>
                </div>

                <!-- BOTONERA -->
                <div class="mt-3 h-8 w-full flex items-center justify-start gap-3">
                    {#each [1,2,3,4] as button}
                        <button class="btn btn-sm bg-base-content text-base-100 btn-circle
                        flex items-center justify-center">
                            <i class="fa-solid fa-heart"></i>
                        </button> 
                    {/each}
                </div>
            </div>
        </div>

        <div class="divider divider-horizontal"></div>

        <div class="lg:w-2/4 h-full flex items-start justify-start flex-col flex-wrap gap-2">
            {#each personalInfo as info}
                <div class="info">
                    <h3 class="info-title">{info.title}</h3>
                    <p class="info-info {info.title === "Estado" ? `${asignColor(info.value)} px-3 rounded-xl font-bold` : ""}">{info.value}</p>
                </div>                 
            {/each}
        </div>
    </div> 

    <div class="h-10 my-4 w-full rounded-xl bg-base-00 px-4 py-1 border-0 border-base-content">
        <h3 class="text-xl font-semibold">{content}</h3>
    </div>

    <div class="min-h-40 my-4 w-full rounded-xl bg-base-300 p-4">
        {#if content === "General"}
            <GeneralContent empleado={ empleado } qr={data.qr}/>
        {:else if content === "Justificaciones"} 
            <JustificacionesContent empleado={ empleado }/>
        {:else if content === "Asistencias"}
            <AsistenciasContent empleado={ empleado }/>
        {/if}
    </div>
</div>

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
</style>