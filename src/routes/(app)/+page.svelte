<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import Chart from "chart.js/auto"

    let { data }: {data: PageData} = $props()
    let { usuario, relacionAsistencias } = $derived(data)

    let asistenciasPctg =   $derived((relacionAsistencias!.total *      100) /relacionAsistencias!.totalDias );
    let ausenciasPctg =     $derived((relacionAsistencias!.ausencias *  100) /relacionAsistencias!.totalDias );
    let retardosPctg =      $derived((relacionAsistencias!.retardos *   100) /relacionAsistencias!.totalDias );

    onMount(() => {
        let canva = document.getElementById("canva") as HTMLCanvasElement
        let donut = document.getElementById("donut") as HTMLCanvasElement

        if(canva) {
            new Chart(canva, {
                type: 'bar',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                    datasets: [{
                        label: `Distribución de Donantes ${new Date().getFullYear()}`,
                        data: [1, 0, 0, 0, 14, 0],
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: '#36A2EB',
                        backgroundColor: '#9BD0F5',
                    }]

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
        <div class="w-full lg:w-[30%] bg-base-300 shadow-md rounded-lg lg:h-full p-3">
            <div class="flex items-center justify-between">
                <h3 class="text-lg"><b>Actividad</b></h3>

                <button class="btn btn-sm btn-outline hover:text-base-100">
                    <i class="fa-solid fa-file-export"></i> 
                    <span>Exportar</span>
                </button>
            </div>

            <div class="border border-base-content/40 rounded-md mt-4 p-2">
                <canvas id="canva"></canvas>
            </div>

            <div class="bg-base-content/10 shadow-md rounded-md mt-4 p-2">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg"><b>Mayores Asistencias</b></h3>
                </div>

                <div class="flex flex-col gap-1 max-h-40 mt-2 overflow-x-hidden overflow-y-auto">
                    {#each { length: 6 } as i}
                        <div class="flex h-24 p-2 items-center justify-between gap-4 bg-base-content/15 w-full rounded-md">
                            <div class="flex h-full gap-3 items-center">
                                <i class="fa-solid fa-user text-3xl"></i>
                                <div>
                                    <div class="font-bold">Carlos Tineo</div>
                                    <div class="text-sm text-base-content/70">C.I V-30.451.822</div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between gap-2 w-fit">
                                <h2 class="text-2xl font-bold">12</h2>

                                <a href="/empleados/{8933618}" class="text-lg btn bg-base-content text-base-100 btn-sm btn-square p-1" aria-label="button">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="max-lg:mt-4 gap-2 flex flex-col w-full lg:w-[70%] bg-base-300 h-full shadow-md rounded-lg p-3">
            <div class="gap-2 flex flex-col lg:flex-row items-start justify-between w-full">
                <div class="w-full lg:w-2/4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg"><b>Relacion de Asistencias</b></h3>

                        <button class="btn btn-sm btn-outline hover:text-base-100">
                            <i class="fa-solid fa-file-export"></i> 
                            <span>Exportar</span>
                        </button>
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
                                <div class="text-sm font-bold absolute left-2/4 top-[110%]">
                                    <span>Asistencias</span>
                                </div>
                            </div>
                            <div class="bg-error" style="width: {ausenciasPctg.toFixed(1)}%;">  
                                <div class="text-sm font-bold absolute left-2/4 top-[110%]">
                                    <span>Ausencias</span>
                                </div>
                            </div>
                            <div class="bg-warning" style="width: {retardosPctg.toFixed(1)}%;">
                                <div class="text-sm font-bold absolute right-2/4 top-[110%]">
                                    <span>Retardos</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex mt-6 items-start justify-between gap-2">
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
            </div>

            <div class="gap-2 flex items-start justify-between w-full">
                <div class="w-full ">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg"><b>Relacion de Asistencias</b></h3>

                        <button class="btn btn-sm btn-outline hover:text-base-100">
                            <i class="fa-solid fa-file-export"></i> 
                            <span>Exportar</span>
                        </button>
                    </div>

                    <div class="border border-base-content/40 rounded-md mt-4 p-2">
                        <div class="mb-3">
                            <div class="text-center w-full">
                                <h3 class="">Total de Asistencias {new Date().getFullYear()}</h3>
                                <h1 class="font-bold text-4xl">32</h1>
                            </div>   
                        </div>

                        <div class="w-full h-3 *:size-full *:relative rounded-md flex items-center gap-1 *:rounded-md">
                            <div class="bg-success">
                                <div class="text-sm font-bold absolute left-0 top-[110%]">
                                    <span>Asistencias</span>
                                </div>
                            </div>
                            <div class="bg-error">  
                                <div class="text-sm font-bold absolute left-0 top-[110%]">
                                    <span>Ausencias</span>
                                </div>
                            </div>
                            <div class="bg-warning">
                                <div class="text-sm font-bold absolute left-0 top-[110%]">
                                    <span>Retardos</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex mt-6 items-start justify-between gap-2">
                            {#each { length: 3 } as i}
                                <div class="w-1/3 min-h-28 bg-base-content h-full rounded-md flex flex-col items-center justify-between p-2 text-base-100">
                                    <i class="fa-solid fa-stopwatch text-3xl"></i>
                                    <!-- <i class="fa-solid fa-calendar-xmark"></i>
                                    <i class="fa-solid fa-clock"></i> -->

                                    <div class="text-center w-full">
                                        <h3 class="text-sm">Asistencias</h3>
                                        <h1 class="font-bold text-2xl">32</h1>
                                    </div>
                                </div> 
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>