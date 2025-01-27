<script lang="ts">
    import {basePath} from "$lib"
    import type { Usuario } from "$lib/database/types";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter"

    // Images Import
    import home_icon from "$lib/images/icons/home_icon.svg"
    import { adminRoutes, routes } from "./navbarItems";
    import menu_icon from "$lib/images/icons/menu_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import logout_icon from "$lib/images/icons/logout_icon.svg"
    import admin_icon from "$lib/images/icons/admin_icon.svg"

    let { usuario }: { usuario: Omit<Usuario, "contraseña"> } = $props()
</script>

{#snippet items()}
    <ul class="items flex flex-col pb-4">
        <!-- Home -->
        <li class="mt-4">
            <img src="{home_icon}" alt="" class="icon">
            <a href="/"
            onclick="{() => {document?.getElementById("side-drawer")?.click()}}">Inicio</a>
        </li>

        <b class="w-full h-[1px] bg-base-content/30 mt-3"></b>

        <!-- Routes -->
        {#each routes as group}
            <h3>{group.name}</h3>

            {#each group.routes as route}
                <li>
                    <img src="{route.icon}" alt="" class="icon">
                    <a href="{basePath}/{route.href}"
                    onclick="{() => {document?.getElementById("side-drawer")?.click()}}">{route.name}</a>
                </li>                   
            {/each}
            <b class="w-full h-[1px] bg-base-content/30 mt-3"></b>
        {/each}

        <!-- Admin Routes -->
        {#if usuario.role.toLowerCase() === "administrador" || usuario.role.toLowerCase() === "admin" || usuario.role.toLocaleLowerCase() == "superadmin" || usuario.role.toLowerCase() === "superadministrador"}
            {#each adminRoutes as group}
                <h3>{group.name}</h3>
                {#each group.routes as route}
                    <li>
                        <img src="{route.icon}" alt="" class="icon">
                        <a href="{basePath}/{route.href}"
                        onclick="{() => {document?.getElementById("side-drawer")?.click()}}">{route.name}</a>
                    </li>                   
                {/each}
            {/each}
        {/if}

        <li class="border-t border-base-content/30 mt-1.5 text-red-500">
            <img src="{logout_icon}" alt="" class="red-filter">
            <a href="{basePath}/logout" class="m-1.5"
            onclick="{() => {document?.getElementById("side-drawer")?.click()}}">Cerrar Sesión</a>
        </li>
    </ul>
{/snippet}

{#snippet drawer()}
    <div class="lg:hidden drawer drawer-start size-fit">
        <input id="side-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content size-fit">
            <!-- Page content here -->
            <label for="side-drawer" class="transition-all duration-200 ease-in-out 
                    p-1 rounded-lg group">
                    <img src="{menu_icon}" alt="" class="filter group-active:invert">
            </label>
        </div>

        <div class="drawer-side z-50">
            <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay overflow-hidden"></label>

            <div class="bg-base-100 min-h-full p-2">
                {@render items()}
            </div>
        </div>
    </div>
{/snippet}

{#snippet dropdown()}
<div class="max-lg:hidden dropdown dropdown-end text-sm z-50">
    <div tabindex="0" role="button" class="transition-all duration-200 ease-in-out 
        p-1 rounded-lg hover:bg-gray-200 active:bg-gray-900 group">
        <img src="{menu_icon}" alt="" class="filter group-active:invert">
    </div>

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <ol tabindex="0" class="menu dropdown-content bg-base-100 z-[1] mt-4 w-52 p-2 shadow">
        <li class="border-t border-base-300 mt-1.5 text-red-500">
            <a href="{basePath}/logout" class="m-1.5">
                <img src="{logout_icon}" alt="" class="red-filter">
                Cerrar Sesión
            </a>
        </li>
    </ol>
</div>
{/snippet}

<nav class=" w-full lg:w-[20rem]
             max-md:max-h-[5rem] lg:h-auto
            lg:overflow-y-scroll 
            px-2 
            flex items-start justify-center
            shadow-sm border-b lg:border-r border-base-content/20 bg-base-300">

    <div class="w-full h-full lg:h-screen flex lg:flex-col p-1 lg:pb-4">
            <!-- US -->
        <div class="w-full
            flex items-center justify-between 
            lg:mt-5 p-1 px-2
            bg-base-300/40 border border-base-content/40 rounded-md">

            <div class="text-sm flex items-center justify-around">
                <div class="flex items-center justify-between gap-3 p-1">
                    <img src="{usuario.role === "Administrador" ? admin_icon : user_icon}" alt="" class="size-10">
                    <div>
                        <p>{usuario.nombre} {usuario.apellido}</p>
                        <b>{capitalizeFirstLetter(usuario.role)}</b>
                    </div>
                </div>
            </div>

            {@render drawer()}
            {@render dropdown()}
        </div>

        <div class="size-full hidden lg:block">
            {@render items()}
        </div>
    </div>
</nav>

<style lang="postcss">
    nav {
        scrollbar-width: thin;
    }
    .items li {
        @apply w-full flex items-center justify-start py-2 px-2 rounded-md text-sm gap-1;
    }
    .items h3 {
        @apply mt-4 my-1;
    }
    .items li:hover {
        @apply bg-base-300;
    }
    .items li:active {
        @apply bg-base-200;
    }
    .items li img {
        @apply size-6 p-0.5;
    }
    .items li a {
        @apply size-full;
    }
</style>