<script lang="ts">
    import { enhance } from "$app/forms";
    import { basePath, formatDateDDMMYY } from "$lib";
    import { checkVigencia } from "$lib/utils/vigencia";
    import type { ActionData } from "./$types";
    import CreateJustificacionModal from "./CreateJustificacionModal.svelte";

    type Justificaciones = {
        empleado: string;
        id: string;
        tipo: string;
        detalles: string;
        razon: string,
        created_by: string
        created_at: string
        fecha_inicio: string;
        fecha_finalizacion: string;
        id_justificacion: string | null;
        id_comprobante: string | null;
        path: string | null;
        nombre_encargado: string | null;
        apellido_encargado: string | null;
    }[] | undefined

    let { empleado, justificaciones, form, encargado }: {encargado: {nombre: string, id: string}, empleado: any, justificaciones: Justificaciones, form: ActionData } = $props()
</script>

<div class="h-max w-full flex items-end justify-between animate-pop-delayed">
    <div class="form-control max-w-xs">
        <div class="label">
            <b class="label-text">Crear Justificación</b>
        </div>
        <button class="btn btn-sm text-base-100 btn-success w-fit"
        onclick={() => {document.getElementById('create_justificacion_modal').showModal()}}>
            <span>+</span>
            <span>Crear</span>
        </button>
    </div>

    <button aria-label="action-button" data-tip="Imprimir Lista de Justificaciones"
    class="action-button btn px-4">
        <i class="fa-solid fa-print"></i>
    </button> 
</div>

<div class="w-full mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
    {#if justificaciones}
        {#each justificaciones as justificacion, i}
            {@const vigencia = checkVigencia(justificacion.fecha_inicio, justificacion.fecha_finalizacion)}

            <div class="border border-base-content/40 rounded-md
                shadow-md bg-base-200 animate-pop-delayed *:px-4"
                style="--delay: {i * 100}ms">
                <!-- HEADER -->
                <div class="w-full min-h-8
                bg-base-200 rounded-md py-1
                flex items-end justify-between text-xs">

                    <div class="flex items-end justify-between gap-3">
                        <div class="form-control">
                            <div class="label p-0 m-0">
                                <b class="label-text text-neutral/70">Fecha de Creacion</b>
                            </div>
                            <b>{new Date(justificacion.created_at).toLocaleDateString('es')}</b>
                        </div>

                        <div class="form-control">
                            <div class="label p-0 m-0">
                                <b class="label-text text-neutral/70">Creado por:</b>
                            </div>
                            <b>{justificacion.nombre_encargado} {justificacion.apellido_encargado}</b>
                        </div>
                    </div>

                    <div class="flex items-end justify-between">
                    </div>
                </div>

                <!-- BODY -->
                <div class="w-full min-h-32 p-2
                bg-base-100 border-y border-base-content/40
                flex items-start justify-between gap-4">
                    <div class="border border-base-content/60 w-1/3 h-full">
                        <img src="/downloads/000?path={justificacion.path}&type=comprobante" alt="" class="w-full h-40">
                    </div>

                    <div class="w-2/3 h-full py-2 flex flex-col justify-between items-start">
                        <div class="w-full">
                            <h3 class="text-lg font-semibold">Razon: {justificacion.razon}</h3> 
                            <p class="text-xs">Tipo: {justificacion.tipo}</p>
                            <p><b class="{vigencia === "Vigente" ? "text-success" : vigencia === "Expirado" ? "text-error" : "text-warning"}">{vigencia}</b> </p>                                   
                            <!-- <p class="text-sm">{justificacion.detalles}</p> -->
                            <div class="form-control text-xs mt-2">
                                <div class="label p-0 m-0">
                                    <b class="label-text">Fecha:</b>
                                </div>
                                <p>Desde {new Date(justificacion.fecha_inicio).toLocaleDateString()} hasta {new Date(justificacion.fecha_finalizacion).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div class="w-full flex items-center justify-end mt-3">
                            <a href="{basePath}/justificaciones/{justificacion.id}" class="btn btn-sm bg-base-content text-base-100">
                                <span>Administrar</span>
                            </a >
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="w-full min-h-4 bg-base-200 rounded-md">

                </div>
            </div>
        {/each}       
    {/if}
</div>

<CreateJustificacionModal empleado={ empleado } form={ form } encargado={encargado}/>


<style lang="postcss">
    * {
        --delay: 100ms;
    }
    .action-button {
        @apply bg-base-content text-base-100
        flex items-center justify-center
        tooltip tooltip-left tooltip-secondary;
    }
</style>