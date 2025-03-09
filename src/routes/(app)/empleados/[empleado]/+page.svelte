<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let { empleado } = $derived(data)

</script>

<div class="bb">
    <h1>{empleado?.primer_nombre} {empleado?.primer_apellido}</h1>
</div>