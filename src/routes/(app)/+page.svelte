<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: {data: PageData} = $props()
    let {usuario} = data
</script>
<div class="">
    <h1 class="text-2xl font-bold border border-base-content/30 rounded-md p-3">Bienvenido usuario: <i>{usuario.nombre} {usuario.apellido}</i></h1>
    <p class="text-sm mt-3">En caso de necesitar ayuda no olvide consultar el <a href="/settings/manual" class="text-blue-500">Manual de Usuario</a></p>

    <div class="size-full flex items-center justify-around flex-wrap mt-6">
        {#each [1,2,3,4] as _}
            <div class="flex w-52 flex-col gap-4">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-28"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
            </div>           
        {/each}
    </div>

    <div class="skeleton h-32 w-full mt-12"></div>
</div>