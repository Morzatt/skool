<script lang="ts">
    import AlertWarning from './AlertWarning.svelte';
    import AlertError from './AlertError.svelte';
    import AlertSuccess from './AlertSuccess.svelte';

    let { form, styles } = $props()

    $effect(() => {
		setTimeout(() => form = null, 6000)
    })
    styles = `${styles} z-50`
</script>

{#if form?.type === "Error"}
    <AlertError form={ form } styles={ styles }/>
{:else if form?.type === "Warning"}
    <AlertWarning form={ form } styles={ styles }/>
{:else if form?.type === "Success"}
    <AlertSuccess form={ form } styles={ styles }/>
{/if}
	