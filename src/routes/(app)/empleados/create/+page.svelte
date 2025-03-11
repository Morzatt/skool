<script lang="ts">
    import { enhance } from '$app/forms';
    import { FormResponse } from '$lib/classes/responses.classes';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import { basePath } from '$lib';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import Select from './Select.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
</script>

<div class="lg:py-6 lg:px-[10rem] size-full relative">
    <a href="{basePath}/empleados" class="mb-6 lg:absolute left-2 top-2 btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
    data-tip="Administrar Empleados">
        <img src="{chevron}" alt="">
    </a>

    <Alert form={ form } styles="text-sm max-w-sm fixed lg:absolute top-16 left-4"/>
    <form action="?/create" method="POST" use:enhance class="w-full
                           bg-base-100 rounded-md shadow-md border border-base-300
                           p-4 ">

        <div class="w-full flex items-center justify-between">
            <h1 class="text-xl font-bold"><i class="fa-solid fa-helmet-safety"></i> Registrar Empleado</h1>
        </div>

        <div class="w-full border border-base-content/30 rounded-md mt-4 p-2">
            <h3 class="font-semibold"> <i class="fa-solid fa-fingerprint"></i> Datos Personales</h3>

            <div class="w-full mt-3 flex flex-col items-start justify-between gap-3">
                <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-5 flex-wrap">
                    <!-- CEDULA -->
                    <label class="form-control max-w-[12rem]">
                        <div class="label">
                            <span class="label-text">Cédula</span>
                        </div>
                        <input type="text" name="cedula" class="input" placeholder="Cédula del Empleado...">
                    </label>   

                    <!-- SEXO -->
                    <label class="form-control max-w-[10rem]">
                        <div class="label">
                            <span class="label-text">Sexo</span>
                        </div>
                        <Select name="sexo" placeholder="Elegir" type="dropdown-bottom" styles="rounded-md" icon="fa-solid fa-venus-mars" options={[
                            {
                                name: "Masculino",
                                value: "Masculino"
                            },
                            {
                                name: "Femenino",
                                value: "Femenino"
                            },
                        ]}/>
                    </label> 

                    <!-- Fecha de Nacimiento -->
                    <label class="form-control max-w-[15rem]">
                        <div class="label">
                            <span class="label-text">Fecha de Nacimiento</span>
                        </div>
                        <input type="date" name="fecha_nacimiento" class="input input-sm focus:outline-0">
                    </label> 
                </div>

                <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-5 flex-wrap">
                    <!-- PRIMER NOMBRE-->
                    <label class="form-control max-w-[15rem]">
                        <div class="label">
                            <span class="label-text">Primer Nombre</span>
                        </div>
                        <input type="text" name="primer_nombre" class="input" placeholder="Primer Nombre del Empleado...">
                    </label>   

                    <!-- SEGUNDO NOMBRE-->
                    <label class="form-control max-w-[15rem]">
                        <div class="label tooltip text-start" data-tip="Dejar en blanco en caso de no aplicar">
                            <span class="label-text">Segundo Nombre <b>*</b></span>
                        </div>
                        <input type="text" name="segundo_nombre" class="input" placeholder="Segundo Nombre del Empleado...">
                    </label>   

                    <!-- PRIMER NOMBRE-->
                    <label class="form-control max-w-[15rem]">
                        <div class="label">
                            <span class="label-text">Primer Apellido</span>
                        </div>
                        <input type="text" name="primer_apellido" class="input" placeholder="Primer Apellido del Empleado...">
                    </label>   

                    <!-- SEGUNDO NOMBRE-->
                    <label class="form-control max-w-[15rem]">
                        <div class="label tooltip text-start" data-tip="Dejar en blanco en caso de no aplicar">
                            <span class="label-text">Segundo Apellido <b>*</b></span>
                        </div>
                        <input type="text" name="segundo_apellido" class="input" placeholder="Segundo Apellido del Empleado...">
                    </label> 
                </div>
            </div>
        </div>

        <div class="w-full border border-base-content/30 rounded-md mt-4 p-2">
            <h3 class="font-semibold"><i class="fa-solid fa-briefcase"></i> Datos Laborales</h3>

            <div class="w-full mt-3 flex flex-col items-start justify-between gap-3 flex-wrap">
                <div class="w-full h-full bg-base-200 rounded-md p-2 flex items-center justify-start gap-5 flex-wrap">
                    <!-- TURNO -->
                    <label class="form-control max-w-[12rem]">
                        <div class="label">
                            <span class="label-text">Turno</span>
                        </div>
                        <Select name="turno" placeholder="Elegir" type="dropdown-top" styles="rounded-md" icon="fa-solid fa-cloud-sun" options={[
                            {
                                name: "Mañana",
                                value: "Mañana"
                            },
                            {
                                name: "Tarde",
                                value: "Tarde"
                            },
                        ]}/>
                    </label>   

                    <!-- Fecha de Nacimiento -->
                    <label class="form-control max-w-[15rem]">
                        <div class="label">
                            <span class="label-text">Departamento</span>
                        </div>
                        <Select name="departamento" placeholder="Elegir" type="dropdown-top" styles="rounded-md" icon="fa-solid fa-cloud-sun" 
                        options={
                            data.departamentos !== undefined ? 
                                data.departamentos.map((i) => {
                                    return {
                                        name: i.nombre_departamento,
                                        value: i.id_departamento
                                    }
                                }) : 
                                [{ name: "No hay departamentos creados", value: "" }]}
                        />
                    </label> 

                    <!-- SEXO -->
                    <label class="form-control max-w-[17rem]">
                        <div class="label">
                            <span class="label-text">Cargo</span>
                        </div>
                        <input type="text" name="cargo" class="input" placeholder="Cargo del Empleado...">
                    </label> 
                </div>
            </div>
        </div>

        <div class="w-full h-max mt-3 flex items-center justify-center">
            <button class="btn btn-success btn-sm btn-wide" type="submit">
                Registrar
            </button>
        </div>
    </form>
</div>


<style lang="postcss">
    .form-control {
        @apply my-2;
    }
    .form-control .label { 
        @apply h-fit p-0 px-2 py-1;
    }
    .form-control .label .labe-text {
        @apply font-bold;
    }

    .input {
        @apply input-bordered focus:outline-0 input-sm w-full;
    }
</style>