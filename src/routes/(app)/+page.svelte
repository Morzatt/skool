<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: {data: PageData} = $props()
    let {usuario} = data
</script>
<div class="">
    <h1 class="text-2xl font-bold border border-base-content/30 rounded-md p-3">Bienvenido usuario: <i>{usuario.nombre} {usuario.apellido}</i></h1>
    <p class="text-sm mt-3">En caso de necesitar ayuda no olvide consultar el <a href="/settings/manual" class="text-blue-500">Manual de Usuario</a></p>

    <div class="w-full p-4 bb">
        <div class="mockup-phone border-primary h-[38em] w-[20rem]">
            <div class="camera"></div>
            <div class="display">
                <div class="artboard artboard-demo phone-1">Hi.</div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="mockup-window bg-base-100 border border-base-300">
            <div class="grid place-content-center h-80">Hello!</div>
        </div>

        <div class="mockup-window border border-base-300 w-full">
            <div class="grid place-content-center border-t border-base-300 h-80">Hello!</div>
        </div>
    </div>
</div>