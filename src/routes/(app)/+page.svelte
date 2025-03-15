<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: {data: PageData} = $props()
    let {usuario} = data
</script>
<div class="">
    <h1 class="text-2xl font-bold border border-base-content/30 rounded-md p-3">Bienvenido usuario: <i>{usuario.nombre} {usuario.apellido}</i></h1>
    <p class="text-sm mt-3">En caso de necesitar ayuda no olvide consultar el <a href="/settings/manual" class="text-blue-500">Manual de Usuario</a></p>
</div>