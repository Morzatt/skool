<script lang="ts">
    import type { PageData } from './$types';
    import usuarioImage from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();
    let { usuario } = data
</script>

<div class="size-full flex flex-col items-center justify-between gap-2">

    <div class="w-full h-full p-2
                flex items-center justify-start
                bg-base-200/50 border border-base-content/30 rounded-md">

        <div class="w-full flex items-center justify-center flex-col">
            <div class="size-fit relative">
                <img src="{usuarioImage}" alt="" class="size-36">
                <button type="button" class="absolute bottom-1 right-1 size-7 flex items-center justify-center p-0.5
                hover:bg-base-content/20 active:bg-base-content/10 rounded-md transition-all duration-200">
                    <img src="{camera_icon}" alt="" class="size-full">
                </button>
            </div>
            <h2 class="text-lg">{usuario.nombre} {usuario.apellido}</h2>
            <h3 class="text-base-content/50 text-sm">{usuario.role}</h3>
        </div>

        <div class="p-3 mt-8 w-full border-t border-base-content/30 font-bold flex items-center justify-between">
            <h1>Estadistica #1: </h1>
            <p class="text-accent">0</p>
        </div>           
        <div class="p-3 w-full border-t border-base-content/30 font-bold flex items-center justify-between">
            <h1>Estadistica #2: </h1>
            <p class="text-info">0</p>
        </div>           
        <div class="p-3 w-full border-y border-base-content/30 font-bold flex items-center justify-between">
            <h1>Estadistica #3: </h1>
            <p class="text-warning">0</p>
        </div>           
    </div>

    <div class="w-full h-full bg-base-200/50 rounded-md border border-base-content/30 p-6">
        <h3 class="text-2xl font-bold">Configurar Perfil</h3>

        <form action="?/editUser" method="POST" use:enhance class="w-full px-3 mt-4">
            <h4>Configurar Nombre y Apellido</h4>
            <div class="flex items-center justify-between w-full gap-4">
                <input type="hidden" name="usuario" value="{usuario.usuario}">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Nombre</span>
                    </div>
                    <input name="nombre" type="text" placeholder="{usuario.nombre}" class="input input-bordered w-full" />
                </label>       

                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Apellido</span>
                    </div>
                    <input name="apellido" type="text" placeholder="{usuario.apellido}" class="input input-bordered w-full" />
                </label>       
            </div>

            <div class="flex justify-end w-full">
                <button class="btn btn-primary btn-wide mt-6 btn-sm" type="submit">Aceptar</button>
            </div>
        </form>

        <form action="?/editPregSeg" method="POST" use:enhance class="w-full px-3">
            <h4>Configurar Preguntas de Seguridad</h4>
            <div class="flex items-center justify-between w-full gap-4 ">
                <input type="hidden" name="usuario" value="{usuario.usuario}">
                <div class="w-2/4">
                    <label class="form-control w-full ">
                        <div class="label">
                            <span class="label-text">Pregunta de Seguridad 1</span>
                        </div>
                        <select class="select select-bordered">
                            <option disabled selected>Pick one</option>
                            <option>Star Wars</option>
                            <option>Harry Potter</option>
                            <option>Lord of the Rings</option>
                            <option>Planet of the Apes</option>
                            <option>Star Trek</option>
                        </select>
                    </label>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Respuesta</span>
                        </div>
                        <input name="apellido" type="text" placeholder="{usuario.apellido}" class="input input-bordered w-full " />
                    </label>     
                </div>

                <div class="w-2/4">
                    <label class="form-control w-full ">
                        <div class="label">
                            <span class="label-text">Pregunta de Seguridad 1</span>
                        </div>
                        <select class="select select-bordered">
                            <option disabled selected>Pick one</option>
                            <option>Star Wars</option>
                            <option>Harry Potter</option>
                            <option>Lord of the Rings</option>
                            <option>Planet of the Apes</option>
                            <option>Star Trek</option>
                        </select>
                    </label>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Respuesta</span>
                        </div>
                        <input name="apellido" type="text" placeholder="{usuario.apellido}" class="input input-bordered w-full " />
                    </label>     
                </div>
            </div>

            <div class="flex justify-end w-full">
                <button class="btn btn-primary btn-wide mt-6 btn-sm" type="submit">Aceptar</button>
            </div>
        </form>
    </div>
</div>

<style lang="postcss">
    input {
        @apply focus:outline-0;
    }

    h4 {
        @apply font-semibold text-slate-700;
    }
</style>