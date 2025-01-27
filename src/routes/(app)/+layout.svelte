<script lang="ts">
    import "../../app.css"

    // Svelte Imports
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
	import { slide } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';

    // Images Import
    import menu_icon from "$lib/images/icons/menu_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import logout_icon from "$lib/images/icons/logout_icon.svg"
    import admin_icon from "$lib/images/icons/admin_icon.svg"
    import administrar_usuario_icon from "$lib/images/icons/administrar_usuario_icon.svg"

    // Components Import
    import Navbar from "$lib/components/Navbar/Navbar.svelte";
    import { basePath } from "$lib";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

    let { data, children }: { data: LayoutData, children: Snippet } = $props();
    let { usuario } = data;
</script>

{#snippet US()}
    <div class="h-full min-w-40 flex items-center justify-around gap-4">

        <div class="text-sm flex items-center justify-around gap-2 px-4 ">
            <span class="*:flex *:items-center *:justify-end *:gap-2">
                <p> {usuario.nombre} {usuario.apellido} </p>
                <b>
                    <img src="{usuario.role === "Administrador" ? admin_icon : user_icon}" alt="" class="size-fit">
                    { capitalizeFirstLetter(usuario.role)}
                </b>
            </span>
        </div>

        <div class="dropdown dropdown-end text-sm">
            <div tabindex="0" role="button" class="transition-all duration-200 ease-in-out 
                p-1 rounded-lg hover:bg-gray-200 active:bg-gray-900 group">
                <img src="{menu_icon}" alt="" class="filter group-active:invert">
            </div>

            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <ul tabindex="0"
            class="menu dropdown-content bg-base-100 z-[1] mt-4 w-52 p-2 shadow">
                <li><a href="{basePath}/settings/account"><img src="{administrar_usuario_icon}" alt="">Mi Usuario</a></li>

                <li class="border-t border-base-300 mt-1.5 text-red-500"><a href="{basePath}/logout" class="m-1.5"><img src="{logout_icon}" alt="" class="red-filter">Cerrar Sesión</a></li>
            </ul>
        </div>
    </div>
{/snippet}
{#snippet themeController()}
   <label class="swap swap-rotate">
        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" class="theme-controller" value="dark" />

        <!-- sun icon -->
        <svg
            class="swap-off size-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>

        <!-- moon icon -->
        <svg
            class="swap-on size-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
    </label> 
{/snippet}

<main class="h-screen w-full flex flex-col lg:flex-row" transition:slide={{ duration: 200, easing: sineInOut, axis: "x" }}>
    <Navbar usuario={ usuario }/>
    <div class="size-full overflow-hidden">

        <div class="p-6 w-full h-full max-h-[calc(100%-3.5rem)] overflow-y-scroll overflow-x-hidden">
            {@render children()}
        </div>
    </div>
</main>

<style lang="postcss">
	main {
		@apply min-h-screen w-full flex items-center justify-center overflow-y-hidden bg-base-200/60;

		/* filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#FFFFFF", endColorstr="#EEEEFA", GradientType=1 ); */
	}
    
    .menu li a img {
        @apply size-5;
    }

    .red-filter {
        filter: brightness(0) saturate(100%) invert(38%) sepia(93%) saturate(2710%) hue-rotate(339deg) brightness(102%) contrast(86%);
    }
</style>
