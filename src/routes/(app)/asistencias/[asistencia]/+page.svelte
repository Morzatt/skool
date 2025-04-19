<script lang="ts">
    import { basePath } from '$lib';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import formatTime from '$lib/utils/formatTime';
    import type { ActionData } from '../$types';
    import type { PageData } from './$types';
    import ObservationCard from './ObservationCard.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { asistencia, observaciones, empleado, justificacion, encargado } = $derived(data)
</script>

<div class="size-full relative">
    <Alert form={ form } styles="absolute top-4 left-4 max-w-sm"/>

    <div class="h-fit w-full relative flex items-center justify-between">
        <a href="{basePath}/asistencias" class="btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
        data-tip="Administrar Asistencias">
            <img src="{chevron}" alt="">
        </a>

        <h3 class="text-3xl font-bold">Asistencia</h3>
    </div>

    <div class="h-fit w-full flex items-center justify-start mt-8 animate-pop gap-5">
        <div>
            <h3 class="text-xl font-bold">{empleado.primer_nombre} {empleado.primer_apellido}</h3>
            <p class="text-lg">{new Date(asistencia?.fecha).toLocaleDateString('es')}</p>
        </div>
        <a href="{basePath}/empleados/{empleado.cedula}" class="text-lg btn bg-base-content text-base-100 btn-sm btn-square p-1" aria-label="button">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
    </div>

    <div class="w-full flex gap-4 items-start justify-between px-2 mt-5">
        <div class="w-full lg:w-3/5 bg-base-300 h-full rounded-xl p-3 animate-pop-delayed" style="--delay: 200ms">

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

        <div class="w-full lg:w-2/5 flex flex-col gap-4 bg-base-200 p-4 rounded-xl">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">Observaciones</h3>
                <button class="btn btn-sm btn-circle bg-base-content text-base-100" aria-label="edit-button">
                    <i class="fa-solid fa-pencil"></i>
                </button>
            </div>
            {#if true}
                {#each [1,2,3] as observacion, i}
                    <ObservationCard index={i}/>       
                {/each}       
            {/if}
        </div>
    </div>

</div>