<script lang="ts">
    import { enhance } from '$app/forms';
    import { basePath } from '$lib';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
    import formatTime from '$lib/utils/formatTime';
    import type { ActionData } from '../$types';
    import type { PageData } from './$types';
    import ObservationCard from './ObservationCard.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { usuario, asistencia, observaciones, empleado, justificacion, encargado } = $derived(data)

    let date = new Date(asistencia?.fecha)
</script>

<div class="size-full relative">
    <Alert form={ form } styles="absolute top-12 left-4 max-w-sm"/>

    <div class="h-fit w-full relative flex items-center justify-between">
        <a href="{basePath}/asistencias" class="btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
        data-tip="Administrar Asistencias">
            <img src="{chevron}" alt="">
        </a>

        <h3 class="text-3xl font-bold">Asistencia</h3>
    </div>

    <div class="w-full flex items-start justify-between mt-8 animate-pop gap-4 px-4 pb-6">
        <div class="w-3/5">
            <div class="w-full flex items-center justify-start gap-12 bg-base-300 shadow-md rounded-lg p-4">
                <div>
                    <h3 class="text-xl font-bold">{empleado.primer_nombre} {empleado.primer_apellido}</h3>
                    <p class="text-base-content/80">{capitalizeFirstLetter(date.toLocaleDateString('es', { weekday: "long" }))}</p>
                    <p class="text-lg">{date.toLocaleDateString('es')}</p>
                </div>
                <a href="{basePath}/empleados/{empleado.cedula}" class="text-lg btn bg-base-content text-base-100 btn-sm btn-square p-1" aria-label="button">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </div>

            <div class="w-full shadow-md mt-4 bg-base-300 h-full rounded-xl p-3 animate-pop-delayed" style="--delay: 200ms">
                <div class="w-full h-full border border-base-content/30 rounded-md p-4">
                    <div class="w-full">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="font-semibold"><i class="fa-solid fa-person"></i> Detalles de Asistencia</h3>
                        </div>
                        <div class="w-full bg-base-200 rounded-md p-4">
                            <div class="flex items-center justify-between mt-1 *:text-center">
                                <div>
                                    <b>Hora de Entrada</b>
                                    <p>{formatTime(asistencia.hora_entrada)}</p>
                                </div>

                                <div>
                                    <b>Estado</b>
                                    <div>
                                        <p class="{asistencia.hora_salida ? "badge badge-success" : "badge badge-warning"}">{asistencia.hora_salida ? "Completado" : "Incompleta"}</p>
                                    </div>
                                </div>

                                <div>
                                    <b>Hora de Salida</b>
                                    <p>{asistencia.hora_salida ? formatTime(asistencia.hora_salida) : "No especificado"}</p>
                                </div>
                            </div>
                        </div>

                        <div class="w-full bg-base-200 rounded-md p-4 mt-4">
                            <div class="flex items-center justify-start gap-8 mt-1">
                                <div>
                                    <b>Encargado del Registro</b>
                                    <div class="text-center">
                                        <p>{encargado!.nombre} {encargado!.apellido}</p>
                                        <p class="text-xs text-base-content/70">{encargado!.usuario}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between mt-4 mb-2">
                            <h3 class="font-semibold"><i class="fa-solid fa-person"></i> Detalles del Empleado</h3>
                        </div>
                        <div class="w-full h-fit p-2
                                bg-base-200 rounded-md
                                flex items-center justify-start gap-8 text-sm">
                            <div>
                                <b>Cedula</b>
                                <p>{empleado.nacionalidad == "Extranjero" ? "E-" : "V-"}{empleado.cedula} </p>
                            </div>
                            <div>
                                <b>Empleado</b>
                                <p>{empleado.primer_nombre} {empleado.primer_apellido}</p>
                            </div>
                                <div>
                                <b>Turno</b>
                                <p>{empleado.turno} </p>
                            </div>                           
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-2/5 flex flex-col gap-4 bg-base-200 shadow-md p-4 rounded-xl">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">Observaciones</h3>
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button"
                onclick="{() => { document.getElementById('create_observacion').showModal() }}">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div class="max-h-[calc(100vh-10rem)] borde pb-6 border-base-content/30 bg-base-300 rounded-lg p-4 overflow-y-auto overflow-x-hidden flex flex-col gap-4">
                {#if observaciones && observaciones.length > 0}
                    {#each observaciones as observacion, i(observacion)}
                        <ObservationCard observacion={observacion} index={i}/>
                    {/each}       
                {:else}
                    <h1 class="text-xl text-base-content/60 text-center">
                        <i class="fa-solid fa-table-cells-row-unlock text-3xl mx-2"></i>
                        No existen observaciones.
                    </h1>
                {/if}
            </div>
        </div>
    </div>
</div>

<dialog id="create_observacion" class="modal -open modal-bottom sm:modal-middle">

    <div class="modal-box relative bg-base-100 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-sm overflow-hidden">

        <form method="dialog">
            <button type="submit" id="create_observacion_close" aria-label="close-modal" 
            class="hover:text-error transition-all duration-200 ease-in-out absolute top-4 right-4">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <i class="fa-solid fa-clipboard shrink-0 stroke-current text-7xl text-center"></i>

        <h3 class="text-lg">Crear Observacion</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center mt-1">Esta acción es irreversible.</p>

        <form action="?/createObservation" method="post" class="w-full mt-4 flex flex-col items-center justify-center"
        use:enhance={() => { document.getElementById('create_observacion_close')?.click() }}>
            <input type="hidden" name="id_asistencia" value="{asistencia.id_asistencia}">
            <input type="hidden" name="encargado" value="{usuario.usuario}">

            <div class="w-full border border-base-content/30 rounded-md mt-2 p-2">
                <h3 class="font-semibold"><i class="fa-solid fa-note-sticky"></i> Añadir Observacion <b>*</b></h3>
                <p class="text-xs">Dejar en blanco en caso de no aplicar.</p>

                <div class="w-full mt-3 flex flex-col items-start justify-between gap-3">
                    <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-6">
                        <fieldset class="fieldset w-full mt-3">
                            <legend class="fieldset-legend font-bold text-sm mb-1">Observacion <b>*</b></legend>
                            <textarea class="textarea textarea-bordered w-full min-h-24" name="observacion" placeholder="Descripcion..."></textarea>
                        </fieldset>
                    </div>
                </div>
            </div>

            <button class="btn bg-base-content text-base-100 px-12 mt-4">
                <span>Crear</span>
            </button>
        </form>
    </div>
</dialog>