<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import * as animations from "svelte/transition"
    import usuarioImage from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import editar_icon from "$lib/images/icons/write_icon.svg"
    import chevron from "$lib/images/icons/chevron_right.svg"
    import { enhance } from '$app/forms';
    import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
    import Alert from "$lib/components/Messages/Alert.svelte"

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { usuario } = data

    let userEdit = $state(false)
</script>

<dialog id="delete_account_modal" class="modal modal-bottom sm:modal-middle">
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

        <h3 class="text-lg mt-3">¿Desea eliminar su Usuario?</h3>
        <p class="text-sm text-base-content/70 text-wrap text-center mt-1">Esta acción es irreversible; no se guardaran datos de los usuarios eliminados y sus tramites en curso serán cancelados inmediatamente.</p>

        <div class="w-fit gap-3 mt-4 flex">

            <form method="dialog">
                <button type="submit" class="btn btn-sm">Volver</button>
            </form>
            
            <form action="?/delete" method="POST" use:enhance>
                <input type="hidden" id="delete_account_close" name="usuario" value="{usuario.usuario}">
                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

<div class="relative h-screen">
    <div class="relative size-full flex flex-col items-center justify-between gap-2">
        <Alert form={form} styles="absolute right-4 top-4 max-w-sm"/>

        <div class="w-full mb-4"><h3 class="text-3xl font-bold">Mi Perfil</h3></div>
        <div class="w-full h-full p-2
                    flex items-center justify-between
                    bg-base-300 rounded-md">

            <div class="lg:w-[85%] flex items-center justify-start gap-2">
                <div class="h-full relative ">
                    <img src="{usuarioImage}" alt="" class="size-36">
                    <button type="button" class="absolute bottom-1 right-1 size-7 flex items-center justify-center p-0.5
                    hover:bg-base-content/20 active:bg-base-content/10 rounded-md transition-all duration-200">
                        <img src="{camera_icon}" alt="" class="size-full">
                    </button>
                </div>

                <div class="h-full flex flex-col lg:flex-row items-center justify-start">
                    <div>
                        <h2 class="text-lg">{usuario.nombre} {usuario.apellido}</h2>
                        <h3 class="text-base-content/50 text-sm">{capitalizeFirstLetter(usuario.role)}</h3>
                        <h3 class="text-sm">Creado el {new Date(usuario.created_at).toLocaleDateString()}</h3>
                    </div>

                    {#if userEdit}
                        <form action="?/editUser" method="post" use:enhance class="ml-8 flex edit"
                            transition:animations.slide={{duration:300}}>
                            <input type="hidden" value={usuario.usuario} name="usuario">

                            <label class="flex items-center justify-start gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    class="h-4 w-4 opacity-70">
                                    <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="text" name="nombre" placeholder="Nombre">
                            </label>

                            <label class="flex items-center justify-start gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    class="h-4 w-4 opacity-70">
                                    <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="text" name="apellido" placeholder="Apellido">
                            </label>

                            <button type="submit" class="btn btn-sm btn-outline btn-success">Guardar</button>
                        </form>                       
                    {/if}
                </div>
            </div>

            <div class="h-full lg:w-[15%] flex items-start justify-end">
                <button class="border border-base-content/30 rounded-md px-4 py-1
                            w-fit  flex items-center justify-between" onclick="{() => { userEdit = !userEdit }}">
                    <img src="{editar_icon}" alt="">
                    <p>Editar</p>
                </button> 
            </div>
        </div>

        <div class="w-full h-full bg-base-300 rounded-md p-6">
            <h3 class="text-xl font-bold">Configurar Perfil</h3>

            <!-- <form action="?/editUser" method="POST" use:enhance class="w-full px-3 mt-4">
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
            </form> -->

            <form action="?/editPregSeg" method="POST" use:enhance class="w-full px-3 mt-4
            pb-6 border-b border-base-content/40">
                <h4>Configurar Preguntas de Seguridad</h4>
                <p class="text-sm">Configure o cambie sus preguntas de seguridad para recuperación de contraseña.</p>
                <input type="hidden" name="usuario" value="{usuario.usuario}">

                <div class="mt-3 min-h-12">
                    <div class="preg">
                        <select name="preg_1" class="w-[40%]">
                            <option disabled selected>Seleccionar</option>
                            <option>Nombre de su Abuela Materna</option>
                            <option>Nombre de su Primera Mascota</option>
                            <option>Titulo de su Libro Favorito</option>
                            <option>Comida Favorita</option>
                        </select>
                        <img src="{chevron}" alt="" class="w-[20%] h-full">
                        <input type="text" name="res_1" class="w-[40%]" placeholder="Respuesta">
                    </div>
                    <div class="preg">
                        <select name="preg_2" class="w-[40%]">
                            <option disabled selected>Seleccionar</option>
                            <option>Pelicula Favorita</option>
                            <option>Profesion de su Madre</option>
                            <option>Color Favorito</option>
                            <option>Canción Favorita</option>
                        </select>
                        <img src="{chevron}" alt="" class="w-[20%] h-full">
                        <input type="text" name="res_2" class="w-[40%]" placeholder="Respuesta">
                    </div>
                </div>

                <div class="flex justify-end w-full">
                    <button class="btn btn-success btn-wide btn-outline mt-6 btn-sm" type="submit">Aceptar</button>
                </div>
            </form>

            <button class="rounded-md
                        px-4 py-1 mt-6 group
                        btn btn-error btn-outline 
                        w-fit 
                        flex items-center justify-between" onclick="{() => { document.getElementById('delete_account_modal').showModal() }}">
                <img src="{delete_icon}" alt="" class="red-filter group-hover:invert">
                <p class="group-hover:text-white">Eliminar Cuenta</p>
            </button> 
        </div>
    </div>
</div>

<style lang="postcss">
    input {
        @apply focus:outline-0;
    }

    h4 {
        @apply font-semibold text-slate-700;
    }

    .preg {
        @apply flex items-center justify-start lg:px-6 h-fit mt-6 w-full lg:w-4/5 ;
    }

    .preg select {
        @apply w-[45%] py-1 px-4 border-base-content/60 rounded-md border bg-transparent;
    }

    .preg img {
        @apply w-[10%] h-8;
    }

    .preg input  {
        @apply w-[45%] py-1 px-4 bg-transparent border rounded-md border-base-content/50;
    }

    .edit {
        @apply flex flex-col lg:flex-row mt-3 lg:mt-0
        w-full lg:max-w-sm gap-3 p-3 border
         border-base-content/40 rounded-md
          origin-top transition-all duration-300;
    }
    .edit label {
        @apply focus:outline-0 bg-transparent border-0 border-b border-base-content/50 lg:w-2/4 w-full;
    }
    .edit input {
        @apply focus:outline-0 bg-transparent border-0 w-full;
    }
</style>