<script lang="ts">
    import type { ActionData, PageData } from "./$types";
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
    import eliminar_icon from "$lib/images/icons/borrar_icon.svg"
    import chevron from "$lib/images/icons/chevron_left.svg"


    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { usuarios } = $derived(data)

    function asignColor(status: "Activo" | "Bloqueado"): string {
        switch (status) {
            case "Activo": 
                return "text-green-800 bg-success"
            case "Bloqueado":
                return "text-red-900 bg-error"
            default: 
                return "text-yellow-700 bg-warning"
        }
    }
    function asignColorInverted(status: "Activo" | "Bloqueado") {
        switch (status) {
            case "Activo": 
                return "text-red-800 bg-error"
            case "Bloqueado":
                return "text-green-800 bg-success"
            default: 
                return "text-yellow-700 bg-warning"
        }
    }

    function asignRange(role: string) {
        switch (role) {
            case "admin":
                return 1
            case "administrador": 
                return 1
            case "superadmin":
                return 2
            default: 
                return 0    
        }
    }

    function submitForm(formId: string) {
        let formElement = document.getElementById(formId) as HTMLFormElement
        formElement.submit()
    }

    function checkRoles(usuario: string) {
        let submitButton = document.getElementById(`${usuario}_role_submit`) as HTMLButtonElement
        let input = document.getElementById(`${usuario}_role_input`) as HTMLInputElement
        let form = document.getElementById(`${usuario}_role_form`) as HTMLFormElement 
        
        if(asignRange(input.value.toLowerCase()) >= usuarioRange) {
            form.action = ""
            form.method = ""
            submitButton.classList.add("btn-disabled")
        }
    }

    let usuarioRange = asignRange(data.usuario.role.toLocaleLowerCase())
</script>

<main class="relative size-full">
    <div class="relative h-screen">
        <Alert form={ form } styles="absolute right-3 top-3 max-w-sm"/>
        <h1 class="text-2xl mt-4 font-bold">Administrar Usuarios</h1>
        <p class="text-sm mt-2">Permisos, Roles de Usuario, Accesibilidad, Estado, Información de Usuario...</p>

        <div class="h-[1px] w-full bg-base-content/30 mt-12"></div>

        <div class="w-full lg:w-5/6 min-h-full flex flex-col p-2 gap-2 overflow-x-auto overflow-y-visible">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Cambiar Rol</th>
                        <th>Acceso</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {#if usuarios}
                        {#each usuarios as usuario, i}
                            {#if usuario.usuario !== data.usuario.usuario} <!-- if user is not the same -->
                                {#if usuario.role.toLocaleLowerCase() !== "superadmin"} <!-- if user is not super admin-->
                                    {#if usuarioRange > usuario.range}
                                        <tr class="animate-pop-delayed" style="--delay: {i * 100}ms">
                                            <td>
                                                <p>{capitalizeFirstLetter(usuario.nombre)} {capitalizeFirstLetter(usuario.apellido)}</p>
                                                <p class="text-xs text-base-content/70">{capitalizeFirstLetter(usuario.role)}</p> 
                                            </td>
                                            <td>
                                                <b class="text-md">{usuario.usuario}</b>
                                                <p class="text-sm {usuario.estado === "Activo" ? "text-green-700" : "text-red-700"}">{usuario.estado}</p>
                                            </td>
                                            <td>
                                                <form action="?/role" method="post" use:enhance class="flex items-center justify-center gap-3 max-w-fit">
                                                    <input type="hidden" name="usuario" value="{usuario.usuario}">

                                                    <div class="dropdown dropdown-bottom">
                                                        <div tabindex="0" role="button" class="btn btn-sm w-max justify-between border border-base-content/60">
                                                            {capitalizeFirstLetter(usuario.role)}
                                                            <img src="{chevron}" alt="" class="rotate-[-90deg]">
                                                        </div>
                                                        <ul class="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow">
                                                            {#if data.usuario.role.toLocaleLowerCase().includes('superadmin')}
                                                                <li><input type="submit" name="role" value="Administrador"></li>                                                           
                                                            {/if}
                                                            <li><input type="submit" name="role" value="Editor"></li>
                                                            <li><input type="submit" name="role" value="Usuario"></li>
                                                        </ul>
                                                    </div>
                                                </form>
                                            </td>
                                            <td>
                                                <form action="?/status" method="post" use:enhance class="flex flex-col items-center justify-center gap-2 max-w-fit">
                                                    <input type="hidden" name="usuario" value="{usuario.usuario}">
                                                    <input type="hidden" name="estado" value={usuario.estado === "Activo" ? "Bloqueado" : "Activo"}>
                                                    <button type="submit" class="{asignColorInverted(usuario.estado)} px-4 py-1 rounded-md font-bold btn-xs">{usuario.estado === "Activo" ? "Bloquear":"Desbloquear"}</button>
                                                </form>
                                            </td>
                                            <td>
                                                <button onclick="{() => {document.getElementById(`delete_user_${usuario.usuario}_modal`)!.showModal()}}" 
                                                    class="hover:bg-red-500 transition-all ease-in-out group rounded-md p-0.5">
                                                    <img src="{eliminar_icon}" alt="" class="group-hover:invert filter">
                                                </button>

                                                <dialog id="delete_user_{usuario.usuario}_modal" class="modal modal-bottom sm:modal-middle">
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

                                                        <h3 class="text-lg mt-3">¿Desea eliminar este usuario?</h3>
                                                        <p class="text-sm text-base-content/70 text-wrap text-center mt-1">Esta acción es irreversible; no se guardaran datos de los usuarios eliminados y sus tramites en curso serán cancelados inmediatamente.</p>

                                                        <div class="w-fit gap-3 mt-4 flex">

                                                            <form method="dialog">
                                                                <button type="submit" class="btn btn-sm">Volver</button>
                                                            </form>
                                                            
                                                            <form action="?/delete" method="POST" use:enhance>
                                                                <input type="hidden" id="delete_user_{usuario.usuario}_close" name="usuario" value="{usuario.usuario}">
                                                                <button onclick="{() => {setTimeout(()=>{}, 50)}}" type="submit" class="btn btn-sm btn-error">Eliminar</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                            </td>
                                        </tr> 
                                    {/if}
                                {/if}
                            {/if}
                        {/each}       
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</main>

<style lang="postcss">
    .modal-container {
        @apply flex max-h-[20rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
    .input {
        @apply focus:outline-0 ;
    }
</style>