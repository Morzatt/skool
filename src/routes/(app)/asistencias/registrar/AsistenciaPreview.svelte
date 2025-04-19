<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { ActionData } from "./$types";
    import type { Departamento, Empleado, InfoContacto, InfoLaboral, InfoPersonal, Usuario } from "$lib/database/types";
    import { formatStringWithDots } from "$lib";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
    import { format } from "date-fns";

    let { empleado = $bindable(), form, usuario, date = $bindable(), type }:
    { 
        empleado: Empleado & Departamento & InfoPersonal & InfoContacto & InfoLaboral | null,
        form: ActionData | null,
        usuario: Omit<Usuario, "contraseña">,
        date: Date | null,
        type: "entrada" | "salida"
    }
    = $props()

    function clearAll() {
        empleado = null;
        date = null;
    }

    function formatTime(time: string): string {
        return new Date(1995,1,1,
        parseInt(time.slice(0, time.lastIndexOf(':'))),
        parseInt(time.slice(time.lastIndexOf(':')+1))
        ).toLocaleTimeString("ve", { hour12: true, hour: "2-digit", minute: "2-digit" })
    }
</script>

<dialog id="asistencia_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-300 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-xl overflow-hidden">
        <Alert form={ form } styles="absolute left-2 top-2 max-w-sm"/>

        <form method="dialog">
            <button type="submit" id="asistencia_close" aria-label="close-modal" 
            class="hover:text-error transition-all duration-200 ease-in-out absolute top-4 right-4"
            onclick="{clearAll}">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <h3 class="text-xl font-bold mt-3 flex items-center justify-start w-full">
            <i class="fa-solid {type === "entrada" ? "fa-hourglass-start" : "fa-hourglass-end"}  mr-2 text-4xl"></i> 
            <span>Registrar {capitalizeFirstLetter(type)}</span>
        </h3>

        <div class="divider m-0 mt-3 p-0"></div>

        <form action="?/{type}" method="post" enctype="multipart/form-data" use:enhance
                class="w-full overflow-y-auto 
                flex flex-col gap-3 items-center justify-start">
            <input type="hidden" name="empleado" value="{empleado?.cedula}">
            <input type="hidden" name="encargado" value="{usuario?.usuario}">
            <input type="hidden" name="fecha" value="{date?.getFullYear()}-{date?.getMonth() === 12 ? "1" : `${(date?.getMonth()+1)}`}-{date?.getDate()}">
            <input type="hidden" name="hora_{type}" value="{date?.toLocaleTimeString('esp')}">

            
            {#if empleado} 
                <!-- CEDULA, NOMBRE Y APELLIDO, DEPARTAMENTO Y CARGO -->
                <div class="w-full border border-base-content/30 rounded-md mt-4 p-2">
                    <h3 class="font-semibold"> <i class="fa-solid fa-person"></i> Detalles de Empleado</h3>

                    <div class="w-full mt-3 flex flex-col items-start justify-between gap-3">
                        <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-6">
                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Cédula <i class="fa-solid fa-fingerprint mx-2"></i></b>
                                </div>
                                <p>{empleado.nacionalidad == "Venezolano" ? "V-" : "E-"}{formatStringWithDots(empleado.cedula)}</p>
                            </div> 

                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Nombre <i class="fa-solid fa-user mx-2"></i></b>
                                </div>
                                <p>{empleado.primer_nombre} {empleado.primer_apellido}</p>
                            </div> 

                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Hora de {type === "entrada" ? "Entrada" : "Salida"}<i class="fa-solid fa-hourglass-half mx-2"></i> </b>
                                </div>
                                <p>{type === "entrada" ? formatTime(empleado.hora_entrada) : formatTime(empleado.hora_salida)}</p>
                            </div> 
                        </div>
                        <div class="w-full h-full bg-base-200 rounded-md p-1 flex items-center justify-start gap-4">
                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Departamento <i class="fa-solid fa-briefcase mx-2"></i></b>
                                </div>
                                <p>{empleado.nombre_departamento}</p>
                            </div> 

                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Cargo<i class="fa-solid fa-thumbtack mx-2"></i></b>
                                </div>
                                <p>{empleado.cargo}</p>
                            </div> 
                        </div>
                    </div>
                </div>
            {/if}

            <!-- FECHA, DIA,  Y HORA -->
            <div class="w-full border border-base-content/30 rounded-md mt-2 p-2">
                <h3 class="font-semibold"> <i class="fa-solid fa-calendar-days"></i> Detalles de Asistencia</h3>

                <div class="w-full mt-3 flex items-start justify-start flex-wrap gap-6">
                    {#if date}
                        <div class="w-fit h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-6">
                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Fecha <i class="fa-solid fa-calendar-day mx-2"></i></b>
                                </div>
                                <p>{date.toLocaleDateString("esp", {})}</p>
                            </div> 
                        </div>
                        <div class="w-fit h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-6">
                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Hora <i class="fa-solid fa-clock mx-2"></i></b>
                                </div>
                                <p>{date.toLocaleTimeString("esp", {hour12: true})}</p>
                            </div> 
                        </div>
                    {/if}
                    <div class="w-fit h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-6">
                        {#if usuario}
                            <div class="form-control">
                                <div class="label">
                                    <b class="label-text">Encargado <i class="fa-solid fa-user-tie mx-2"></i></b>
                                </div>
                                <p>{usuario.nombre} {usuario.apellido}</p>
                            </div>                            
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Observacion -->
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

            <button type="submit" class="btn btn-sm btn-success text-base-100 px-12">
                <span>Crear</span>
            </button>   
        </form>     
    </div>
</dialog>

<style lang="postcss">
    .file-label {
        @apply w-[10rem] min-h-[9rem] relative
        flex flex-col items-center justify-center
        border-2 border-slate-600 rounded-md border-dashed
        shadow-md
        cursor-pointer p-2 gap-4
        transition-all duration-150 ease-in-out
        origin-left
        active:bg-base-300;
        --delay: 100ms;
    }

    .file-label:hover {
        @apply drop-shadow-2xl shadow-xl bg-base-content text-base-100
        border-0;

        img {
            @apply filter invert;
        }
    }
    
    .form-control {
        @apply my-2;
    }
    .form-control .label { 
        @apply h-fit p-0;
    }
    .form-control .label .label-text {
        @apply font-bold;
    }

    .input {
        @apply input-bordered focus:outline-0 input-sm w-full;
    }
</style>