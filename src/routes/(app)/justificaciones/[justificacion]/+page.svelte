<script lang="ts">
    import { basePath } from '$lib';
    import chevron from "$lib/images/icons/chevron_left.svg"
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let { justificacion } = $derived(data)
</script>

<div class="w-full h-full">
    <div class="h-12 w-full mb-4 relative flex items-center justify-between">
        <a href="{basePath}/empleados" class="btn btn-accent btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
        data-tip="Administrar Empleados">
            <img src="{chevron}" alt="">
        </a>

        <h3 class="text-3xl font-bold">Justificación</h3>
    </div>

    <div class="w-full h-[calc(100%-(3rem+1rem))]
    mt-4 p-4
    bg-base-300 rounded-md
    flex items-start justify-between gap-5">
        <!-- IMAGE -->
        <div class="w-[40%] h-full flex items-center justify-center gap-2 p-1">
            <button class="btn bg-base-content text-base-100"> {"<"} </button>
            <img src="{justificacion.path}" alt="" class="h-full border border-base-content/40">
            <button class="btn bg-base-content text-base-100"> {">"} </button>
        </div>

        <!-- DATA -->
        <div class="w-[60%] h-full bb">

        </div>
    </div>
</div>