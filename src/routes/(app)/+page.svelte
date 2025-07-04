<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import Chart from "chart.js/auto"
    import { formatStringWithDots } from "$lib";
    import formatTime from "$lib/utils/formatTime";

    let { data }: {data: PageData} = $props()
    let { usuario, relacionAsistencias, mayoresAsistencias, latestAsistencias, distribucionAsistencias, asistenciasUsuario } = $derived(data)

    let asistenciasPctg =   $derived((relacionAsistencias!.total *      100) /relacionAsistencias!.totalDias );
    let ausenciasPctg =     $derived((relacionAsistencias!.ausencias *  100) /relacionAsistencias!.totalDias );
    let retardosPctg =      $derived((relacionAsistencias!.retardos *   100) /relacionAsistencias!.totalDias );

    onMount(() => {
        let canva = document.getElementById("canva") as HTMLCanvasElement

        if(canva) {
            new Chart(canva, {
                type: 'bar',
                data: {
                    ...distribucionAsistencias
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                }
            })
        }
    })

</script>
<div class="h-full max-h-[76vh]">
    <div class="w-full">
        <h1 class="text-2xl font-bold border border-base-content/30 rounded-md p-3">Bienvenido usuario: <i>{usuario.nombre} {usuario.apellido}</i></h1>
        <p class="text-sm mt-3">En caso de necesitar ayuda no olvide consultar el <a href="/settings/manual" class="text-blue-500">Manual de Usuario</a></p>
    </div>

    <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-4 mt-4 h-full">
        <div class="w-full lg:w-[30%] bg-base-300 shadow-md rounded-lg lg:h-full p-3 animate-pop">
            <div class="flex items-center justify-between">
                <h3 class="text-lg"><b>Actividad</b></h3>
            </div>

            <div class="border border-base-content/40 rounded-md mt-4 p-0.5">
                <canvas id="canva"></canvas>
            </div>

            <div class="bg-base-content/10 shadow-md rounded-md mt-4 p-2">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg"><b>Mayores Asistencias</b></h3>
                </div>

                <div class="flex flex-col gap-1 max-h-40 mt-2 overflow-x-hidden overflow-y-auto">
                    {#if mayoresAsistencias && mayoresAsistencias.length > 0}
                        {#each mayoresAsistencias as empleado}
                            <div class="flex h-24 p-2 items-center justify-between gap-4 bg-base-content/15 w-full rounded-md">
                                <div class="flex h-full gap-3 items-center">
                                    <i class="fa-solid fa-user text-3xl"></i>
                                    <div>
                                        <div class="font-bold">{empleado.primer_nombre} {empleado.primer_apellido}</div>
                                        <div class="text-sm text-base-content/70">C.I V-{formatStringWithDots(empleado.cedula)}</div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between gap-2 w-fit">
                                    <h2 class="text-2xl font-bold">{empleado.total_asistencias}</h2>

                                    <a href="/empleados/{empleado.cedula}" class="text-lg btn bg-base-content text-base-100 btn-sm btn-square p-1" aria-label="button">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </a>
                                </div>
                            </div>
                        {/each}           
                    {/if}
                </div>
            </div>
        </div>

        <div class="max-lg:mt-4 gap-2 flex flex-col w-full lg:w-[70%] bg-base-300 shadow-md rounded-lg p-3 animate-pop-delayed" style="--delay: 100ms;">
            <div class="gap-2 flex flex-col lg:flex-row items-start justify-between w-full">
                <!-- RELACION DE ASISTENCIAS -->
                <div class="w-full lg:w-2/4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg"><b>Relacion de Asistencias</b></h3>
                    </div>

                    <div class="border border-base-content/40 rounded-md mt-4 p-2">
                        <div class="mb-3">
                            <div class="text-center w-full">
                                <h3 class="">Total de Asistencias {new Date().toLocaleDateString('es', { month:'long', year: 'numeric' })}</h3>
                                <h1 class="font-bold text-4xl">{relacionAsistencias?.totalDias}</h1>
                            </div>   
                        </div>

                        <div class="w-full h-3 *:h-full *:relative rounded-md flex items-center gap-1 *:rounded-md">
                            <div class="bg-success " style="width: {asistenciasPctg.toFixed(1)}%">
                            </div>
                            <div class="bg-error" style="width: {ausenciasPctg.toFixed(1)}%;">  
                            </div>
                            <div class="bg-warning" style="width: {retardosPctg.toFixed(1)}%;">
                            </div>
                        </div>

                        <div class="w-full mt-2 gap-1 flex items-center justify-start 
                        *:flex *:gap-1 *:justify-start *:items-center *:text-sm *:border *:border-base-content/30 *:rounded-xl *:py-0.5 *:px-1 ">
                            <div>
                                <div class="rounded-full size-4 border border-base-content/50 bg-success"></div>
                                <span>Asistencias</span>
                            </div>
                            <div>
                                <div class="rounded-full size-4 border border-base-content/50 bg-error"></div>
                                <span>Ausencias</span>
                            </div>
                            <div>
                                <div class="rounded-full size-4 border border-base-content/50 bg-warning"></div>
                                <span>Retardos</span>
                            </div>
                        </div>

                        <div class="flex mt-2 items-start justify-between gap-2">
                            <div class="w-1/3 min-h-28 bg-base-content h-full rounded-md flex flex-col items-center justify-between p-2 text-base-100">
                                <i class="fa-solid fa-stopwatch text-3xl"></i>
                                <div class="text-center w-full">
                                    <h3 class="text-sm">Asistencias</h3>
                                    <h1 class="font-bold text-2xl">{relacionAsistencias?.total}</h1>
                                </div>
                            </div> 
                            <div class="w-1/3 min-h-28 bg-base-content h-full rounded-md flex flex-col items-center justify-between p-2 text-base-100">
                                <i class="fa-solid fa-calendar-xmark text-3xl"></i>
                                <div class="text-center w-full">
                                    <h3 class="text-sm">Ausencias</h3>
                                    <h1 class="font-bold text-2xl">{relacionAsistencias?.ausencias}</h1>
                                </div>
                            </div> 
                            <div class="w-1/3 min-h-28 bg-base-content h-full rounded-md flex flex-col items-center justify-between p-2 text-base-100">
                                <i class="fa-solid fa-clock text-3xl"></i>
                                <div class="text-center w-full">
                                    <h3 class="text-sm">Retardos</h3>
                                    <h1 class="font-bold text-2xl">{relacionAsistencias?.retardos}</h1>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>

                <!-- Ultimas Asistencias-->
                <div class="w-full h-full lg:w-2/4 row-span-2">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg"><b>Ultimas Asistencias</b></h3>
                        <a href="/asistencias/registrar" class="btn btn-sm btn-outline hover:text-base-100">
                            <i class="fa-solid fa-file-export"></i> 
                            <span>Registrar</span>
                        </a>
                    </div>

                    <div class="bg-base-content/5 rounded-md mt-4 p-2 h-[16rem]">
                        <div class="flex flex-col gap-1 mt-2 max-h-[95%] overflow-x-hidden overflow-y-auto">
                            {#if latestAsistencias && latestAsistencias.length > 0}
                                {#each latestAsistencias as asistencia}
                                    {@const str = asistencia.id_asistencia.split('_')[1]}
                                    {@const asistenciaPath = `${asistencia.id_asistencia.split('_')[0]}_${str.slice(0,4)}-${str.slice(4,5)}-${str.slice(5,6)}`}

                                    <div class="flex h-24 p-2 items-center justify-between gap-4 bg-base-content/15 w-full rounded-md">
                                        <div class="flex h-full gap-5 items-center">
                                            <i class="fa-solid fa-calendar-days text-5xl"></i>
                                            <div>
                                                <div class="font-bold">{asistencia.primer_nombre} {asistencia.primer_apellido}</div>
                                                <div class="text-sm text-base-content/70">C.I V-{formatStringWithDots(asistencia.cedula)}</div>
                                                <div class="text-sm font-bold text-base-content/70">Entrada: {formatTime(asistencia.hora_entrada)}</div>
                                                <div class="font-bold  {asistencia.hora_entrada > asistencia.entrada_estimada ? "text-warning" : "text-success"}">
                                                    {
                                                        asistencia.hora_entrada > asistencia.entrada_estimada ? "Tardanza" : "A tiempo"
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center justify-between gap-2 w-fit">
                                            <a href="/asistencias/{asistenciaPath}" class="text-lg btn bg-base-content text-base-100 btn-sm btn-square p-1" aria-label="button">
                                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                            </a>
                                        </div>
                                    </div>
                                {/each}           
                            {:else}
                                <h2 class="text-xl text-base-content/70 font-bold mx-2">No hay últimas asistencias</h2>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <div class="gap-2 flex items-start justify-between w-full">
                <div class="border border-base-content/40 rounded-md mt-4 p-2 w-full flex items-center justify-between gap-2">
                    <div class="flex justify-between gap-4">
                        <i class="fa-solid fa-circle-user text-7xl"></i>

                        <div>
                            <b class="text-xl">{usuario.nombre} {usuario.apellido}</b>
                            <br>
                            <i>{usuario.usuario}</i>
                            <br>
                            <i>{usuario.role}</i>
                        </div>
                    </div>

                    <div class="stats w-fit bg-base-200 text-base-content shadow border border-base-content/20">
                        <div class="stat">
                            <div class="stat-title text-wrap">Asistencias Registradas</div>
                            <div class="stat-value text-success">{asistenciasUsuario?.asistencias}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-wrap">Observaciones Realizadas</div>
                            <div class="stat-value">{asistenciasUsuario?.observaciones}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>