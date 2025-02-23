<svelte:head>
    <title>Sistema de Gestión Empresarial para la Unidad Educativa Estadal Bolivariana "Andrés Bello"</title>
</svelte:head>

<script lang="ts">
    import "../../../app.css"
    import * as animation from "svelte/transition"
    import { sineInOut } from "svelte/easing";
    import { enhance } from "$app/forms";
    import pwdIcon from "$lib/images/icons/details_icon.svg"
    import { basePath, showPwd } from "$lib";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { ActionData, PageData } from "./$types";
    import { goto, invalidateAll } from "$app/navigation";
    import Captcha from "$lib/components/Captcha/Captcha.svelte";

    import bg_1 from "$lib/images/bg-5.gif"
    import school_logo from "$lib/images/logo.png"
    import question_icon from "$lib/images/icons/question_icon.svg"
    import login_icon from "$lib/images/icons/login.svg"
    import register_icon from "$lib/images/icons/register.svg"
    import recovery_icon from "$lib/images/icons/recovery.svg"

    let pageData: { data: PageData, form: ActionData } = $props()

    let { form } = $derived(pageData)
    let { text, data } = $derived(pageData.data)

    function invalidateLoad() {
        let response = invalidateAll()
        return response
    }

    type FormContent = "login" | "register" | "pwd" | "pregseg" 

	let usuario: string | undefined = $state("");
    let formContent: FormContent = $state("login")

    function addClass(element: HTMLElement, classes: string[]) {
        for (let i in classes) {
            element.classList.add(i)
        }
    }

    function removeClass(element: HTMLElement, classes: string[]) {
        for (let i in classes) {
            element.classList.remove(i)
        }
    }

    async function checkUsername() {
        let indicator = document.getElementById("user_indicator") as HTMLSpanElement
        let username_input = document.getElementById("register_username") as HTMLInputElement
        if (username_input.value == "") {
            removeClass(indicator, ["text-red-500"])
            addClass(indicator, ["text-gray-400"])
            indicator.classList.remove("text-green-700")
            indicator.textContent = "Inserte Usuario"
            return
        }
        try {
            let result = await fetch(`${basePath}/auth?username=${username_input.value}`)
            if (result.status === 200) {
                indicator.classList.remove("text-red-500")
                indicator.classList.add("text-green-700")
                indicator.textContent = "Usuario Disponible"
            } else {
                indicator.classList.remove("text-green-700")
                indicator.classList.add("text-red-500")
                indicator.textContent = "Usuario Ocupado"
            }   
        } catch (error) {
            console.log(error)        
        }
    }

    async function checkPregSeg() {
        let indicator = document.getElementById("recovery_user_indicator") as HTMLSpanElement
        let username_input = document.getElementById("recovery_username") as HTMLInputElement

        let preg_1_indicator = document.getElementById("preg_1_indicator") as HTMLSpanElement
        let preg_2_indicator = document.getElementById("preg_2_indicator") as HTMLSpanElement

        if (username_input.value == "") {
            removeClass(indicator, ["text-red-500"])
            addClass(indicator, ["text-gray-400"])
            indicator.classList.remove("text-green-700")
            indicator.textContent = "Inserte Usuario"
            preg_1_indicator.textContent = "Pregunta de Seguridad"
            preg_2_indicator.textContent = "Pregunta de Seguridad"
            return
        }

        try {
            let result = await fetch(`${basePath}/auth?username=${username_input.value}`)
            if (result.status !== 200) {
                indicator.classList.remove("text-red-500")
                indicator.classList.add("text-green-700")
                indicator.textContent = "Usuario Obtenido"

                let response = await fetch(`${basePath}/auth?username=${username_input.value}`, {
                    method: "POST",
                })
                if (response.ok) {
                    let data = await response.json()
                    console.log("data: ", data)
                    preg_1_indicator.textContent= data.preg_1
                    preg_2_indicator.textContent= data.preg_2
                }
            } else {
                indicator.classList.remove("text-green-700")
                indicator.classList.add("text-red-500")
                indicator.textContent = "El usuario no Existe"
                preg_1_indicator.textContent = "Pregunta de Seguridad"
                preg_2_indicator.textContent = "Pregunta de Seguridad"
            }   
        } catch (error) {
            console.log(error)        
        }
    }

    $effect(() => {
        if (form?.success && form?.form === "register") { formContent = "pregseg"; usuario = form?.usuario };
		if (form?.success && form?.form === "check") { usuario = form?.usuario };
		if (form?.success && form?.form === "pregseg") { formContent = "login"; usuario = undefined };
		if (form?.success && form?.form === "recovery") { formContent = "login"; usuario = undefined };
		if (form?.success && form?.form === "login") { setTimeout(() => {goto("/")}, 1000) }
    })
    let captchaResult = $state(false);
</script>

{#snippet loginForm()}
    <form action="?/login" method="POST" use:enhance transition:animation.fly={{duration:200, x: 200, y:0,  opacity: 0.8 }}
    class="flex flex-col items-center justify-center p-4 border border-base-content/30" >
        <h3 class="text-lg font-bold">Inicio de Sesión</h3>
        <p class="text-xs text-center mb-3 mt-1">Ingrese sus datos de usuario para acceder.</p>
        <div class="w-full flex flex-col gap-3 mt-1">
            <label class="form-input rounded-none flex items-center gap-2">
                <i class="fa-regular fa-circle-user"></i>
                <input type="text" class="grow" placeholder="Usuario" name="usuario" />
            </label>

            <label class="form-input flex items-center rounded-none gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    fill-rule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clip-rule="evenodd" />
                </svg>
                <input type="password" class="grow" placeholder="Contraseña" id="loginPwd" name="contraseña"/>

                <button class="tooltip" data-tip="Mostrar Contraseña" type="button" onclick="{() => {showPwd("loginPwd")}}">
                    <img src="{pwdIcon}" alt="">
                </button>
            </label>

            <Captcha text={ text } data={ data } invalidate={invalidateLoad} bind:result={captchaResult}/>
            <input type="hidden" name="captcha" value={captchaResult}>
        </div>
        <button class="btn btn-wide mt-4 btn-primary" type="submit">Acceder</button>
    </form>
{/snippet}

{#snippet registerForm()}
    <form action="?/register" method="POST" use:enhance transition:animation.fly={{duration:200, x: 200, y:0,  opacity: 0.8 }}
    class="flex flex-col gap-2 items-center px-2 border border-base-content/30 py-4" >
        <p class="text-lg font-bold">Registro</p>

        <div class="w-full flex items-center justify-around gap-2 mt-5">
            <label class="form-input input-md rounded-none flex items-center gap-2 w-2/4 after:content-['Nombre']">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" class="w-full grow shrink" placeholder="Nombre" name="nombre" />
            </label>

            <label class="form-input input-md rounded-none flex items-center gap-2 w-2/4 after:content-['Apellido']">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" class="w-full grow shrink" placeholder="Apellido" name="apellido"/>
            </label>
        </div>

        <label class="form-control w-full">
            <div class="label">
                <span class="text-xs text-gray-400" id="user_indicator">Inserte Usuario</span>
            </div>

            <label class="form-input input-md rounded-none flex items-center gap-2 w-full after:content-['Usuario']">
                <i class="fa-regular fa-circle-user"></i>
                <input type="text" class="w-full grow shrink" placeholder="Usuario" name="usuario" id="register_username"
                oninput="{checkUsername}"/>
            </label>
        </label>

        <label class="form-input input-md rounded-none flex items-center gap-2 w-full mt-1 after:content-['Contraseña']">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-6 opacity-70">
                <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd" />
            </svg>
            <input type="password" class="w-full grow shrink" placeholder="Contraseña" id="registerPwd" name="contraseña" />
            
            <button class="tooltip" data-tip="Mostrar Contraseña" type="button" onclick="{() => {showPwd("registerPwd")}}">
                <img src="{pwdIcon}" alt="">
            </button>
        </label>

        <button class="btn btn-wide mt-4 btn-success" type="submit">Registrarse</button>
    </form>
{/snippet}

{#snippet recovery()}
	<form class="w-5/6 flex flex-col justify-center items-center" transition:animation.fly={{duration:200, x: 200, y:0,  opacity: 0.8 }}
		method="POST" action="?/recovery" use:enhance>
		{#if form?.pregseg}
			<input type="hidden" name="usuario" value={usuario}>

			<label class="form-control bg-transparent focus:outline-0 w-full max-w-xs">
				<div class="label">
					<span class="label-text">{form.pregseg.preg_1}</span>
				</div>
				<input name="res_1" type="text" placeholder="Respuesta" class="input bg-transparent input-bordered w-full max-w-xs" />
			</label>

			<label class="form-control w-full max-w-xs focus:outline-0 bg-transparent">
				<div class="label">
					<span class="label-text">{form.pregseg.preg_2}</span>
				</div>
				<input name="res_2" type="text" placeholder="Respuesta" class="input bg-transparent input-bordered w-full max-w-xs" />
			</label>

			<label class="form-control w-full max-w-xs focus:outline-0 bg-transparent mt-2">
				<div class="label">
					<span class="label-text">Nueva Contraseña</span>
				</div>

                <div class="w-full input input-bordered flex items-center gap-2 bg-transparent focus:outline-0">
                    <input id="recoveryPwd" type="password" class="grow bg-transparent focus:outline-0" name="contraseña"/>
                    <button type="button" onclick={() => {showPwd("recoveryPwd")}} data-tip="Mostrar Contraseña" aria-label="show"
                        class="md:tooltip size-7 rounded-lg hover:bg-slate-300 transition-all ease-linear duration-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            class="size-6 opacity-70">
                            <path
                            fill-rule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
			</label>
		{/if}

		<button type="submit" class="mt-4 btn btn-wide bg-green-800 text-white hover:bg-green-700 active:bg-green-500">Cambiar</button>
	</form>
{/snippet}

{#snippet pwd()}
	<div id="pwd" class="w-full h-fit border border-base-content/30 p-3" transition:animation.fly={{duration:200, x: 200, y:0,  opacity: 0.8 }}>
		<h1 class="text-center text-xl font-semibold">Recuperar Contraseña</h1>
        <p class="text-xs text-center mt-1">Recupere su contraseña de ingreso mediante la validación de sus preguntas de segurida asociadas.</p>

		<div class="w-full flex items-center justify-center mt-4">
			{#if !form?.pregseg}
			<!-- CHECK IF USER EXISTS AND RETURN PREGSEG -->
				<form class="w-5/6 *:my-2 flex flex-col justify-center items-center"
				method="POST" action="?/check" use:enhance>

                    <label class="form-input input-md rounded-none 
                    flex items-center gap-2 
                    w-full  after:content-['Introduzca_su_Usuario']">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            class="h-4 w-4 opacity-70">
                            <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
						<input name="usuario" type="text" placeholder="Nombre de Usuario" class="w-full max-w-xs grow shrink" />
                    </label>

					<button type="submit" class="btn btn-wide btn-info text-white hover:bg-purple-700 active:bg-purple-500">Buscar</button>
				</form>				
			{:else}
			<!-- SHOW PREGSEG AND ACTUALLY RECOVER PASSWORD -->
				{@render recovery()}
			{/if}			
		</div>
	</div>
{/snippet}

{#snippet pregseg()}
	<div id="pregseg" class="border border-base-content/30 p-1" transition:animation.fly={{duration:200, x: 200, y:0,  opacity: 0.8}}>
		<h1 class="text-center text-lg font-semibold">Preguntas de Seguridad</h1>

		<div class="w-full flex items-center justify-center mt-1">

			<form class="w-5/6 *:my-2 flex flex-col justify-center items-center"
			method="POST" action="?/pregseg" use:enhance>
				<!-- USUARIO -->
				<input type="hidden" name="usuario" value={usuario}>

				<!-- PREG1 -->
				<label class="form-control w-full focus:outline-0 bg-transparent rounded-none">
					<div class="label">
						<span class="label-text">Seleccione una pregunta de seguridad</span>
					</div>
					<select class="focus:outline-0 bg-transparent select border border-base-content/30" name="preg_1">
						<option disabled selected>Seleccionar</option>
						<option>Nombre de su Abuela Materna</option>
						<option>Nombre de su Primera Mascota</option>
						<option>Titulo de su Libro Favorito</option>
						<option>Comida Favorita</option>
					</select>
				</label>

				<!-- RES1 -->
				<label class="w-full input border border-base-content/30 bg-transparent focus:outline-0 rounded-none flex items-center gap-2 ">
					<input type="text" class="grow focus:outline-0 bg-transparent rounded-none" name="res_1"/>
					<img src="{question_icon}" alt="" class="size-7 opacity-70">
				</label>

				<!-- PREG2 -->
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Seleccione otra pregunta de seguridad</span>
					</div>
					<select class="focus:outline-0 bg-transparent select border border-base-content/30" name="preg_2">
						<option disabled selected>Seleccionar</option>
						<option>Pelicula Favorita</option>
						<option>Profesion de su Madre</option>
						<option>Color Favorito</option>
						<option>Canción Favorita</option>
					</select>
				</label>

				<!-- RES2 -->
				<label class="w-full input border border-base-content/30 bg-transparent focus:outline-0 rounded-none flex items-center gap-2 ">
					<input type="text" class="grow focus:outline-0 bg-transparent rounded-none" name="res_2"/>
					<img src="{question_icon}" alt="" class="size-7 opacity-70">
				</label>

				<button type="submit" class="btn btn-wide bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-300">Aceptar</button>
			</form>
		</div>
	</div>
{/snippet}

<main transition:animation.slide={{ duration: 200, easing: sineInOut, axis: "x" }}
class="max-h-screen w-full flex items-center justify-center overflow-y-hidden bg-base-content">

    <Alert form={ form } styles="absolute left-10 top-6 max-w-[25rem]"/>

	<div class="h-screen w-full lg:w-[85%] xl:w-4/5
            py-5 px-2 
            border-0 border-red-500 
            flex items-center justify-center">

        <div class="main-container 
            w-full h-full lg:h-5/6
            border-0 border-base-content/30 rounded-sm
            p-2 bg-white shadow-xl
            grid 
            grid-cols-1 lg:grid-cols-[0.5fr_4fr_2.5fr] 
            grid-rows-[0.5fr_4fr_4fr] lg:grid-rows-1
            gap-1">

            <div class="join rounded-none lg:join-vertical flex items-center justify-start mb-4 gap-2 *:w-full">
                <img src="{school_logo}" alt="" class="join-item max-w-14 max-h-14 p-0 "/>

                <button class="join-item nav-icon {formContent === "login" ? "nav-icon-active" : ""}" 
                onclick={() => formContent = "login"}>
                    <i class="fa-regular fa-id-card"></i>
                    <p>Acceder</p>
                </button>

                <button class="join-item nav-icon {formContent === "register" ? "nav-icon-active" : ""}" 
                onclick={() => formContent = "register"}>
                    <i class="fa-solid fa-pen-to-square"></i>
                    <p>Registrarse</p>
                </button>

                <button class="join-item nav-icon {formContent === "pwd" ? "nav-icon-active" : ""}" 
                onclick={() => formContent = "pwd"}>
                    <img src="{recovery_icon}" alt="" class="size-5">
                    <p>Recuperar</p> 
                </button>
            </div>

            <div class="relative">
                <img src="{bg_1}" alt="" 
                class="border-0 rounded-sm border-base-content/40
                 w-full h-full lg:h-[120%] 
                 absolute 
                 top-[50%] left-[50%] 
                 translate-x-[-50%] translate-y-[-50%]">

                 <div class="absolute 
                 left-0 bottom-0 lg:bottom-[-3rem]
                  bg-black/50 text-white p-1 px-4 m-2 rounded-md">
                    <h3 class="text-xl italic font-bold">"Moral y Luces son nuestras Primeras Necesidades"</h3>    
                    <p class="text-sm">Simón Bolívar</p>
                 </div>
            </div>

            <div class="lg:overflow-hidden w-full max-lg:min-h-[30rem] *:min-h-[97%] *:border-0 max-lg:mt-4">
                {#if formContent === "register"}
                    {@render registerForm()} 
                {:else if formContent === "pregseg"}
                    {@render pregseg()} 
                {:else if formContent === "pwd"}
                    {@render pwd()}
                {:else}
                    {@render loginForm()} 
                {/if}
            </div>
        </div>
    </div>
</main>

<style lang="postcss">
    label input {
        @apply w-full grow shrink focus:outline-0 ;
    }

    .form-input {
        @apply focus:outline-0 bg-transparent border-b border-base-content/20 px-4 pb-1 my-3 relative;
    }

    .form-input:after {
        @apply absolute top-[-18px] left-2 text-xs text-base-content/50;
    }

    .form-input .label {
        @apply text-xs text-base-content/50;
    }

    .nav-icon {
        @apply p-1 lg:p-3
         lg:min-h-24 
         transition-all duration-100 ease-in-out 
         border-[4px] border-transparent
         max-lg:text-sm
         flex flex-col lg:flex-row items-center justify-center gap-2;
    }

    .nav-icon-active {
        @apply border-b-blue-500 lg:border-l-blue-500 lg:border-b-transparent translate-y-[-5px] lg:translate-x-[-5px];
    }
</style>