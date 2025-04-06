<script lang="ts">
    import FilterSelect from '../departamentos/FilterSelect.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="*: w-full min-h-full lg:h-full">
    <div class="w-full h-12
        flex items-center justify-between flex-wrap">
        <h1 class="text-2xl font-semibold">Justificaciones</h1>
    </div>

    <div class="w-full mt-4">
        <h3 class="text-xl font-medium">Todas las Justificaciones</h3>
    </div>
</div>