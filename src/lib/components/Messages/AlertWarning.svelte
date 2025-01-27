<script lang="ts">
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter"

    // Images Import
	import warning_icon from "$lib/images/icons/warning_icon.svg"

    let { form, styles } = $props()
    let visible = $state(false)

    $effect(() => {
        if (form?.success === false) {
            // if (true) {
            visible = true;
            setTimeout(() => {
                visible = false;
            }, 10000)
        }
    })
</script>

{#if visible}
    <div  role="alert" class="alert alert-warning {styles}" transition:slide={{ duration: 100, easing: sineInOut, axis: "x" }}>
        <img src="{warning_icon}" alt="">
        <div class="block text-yellow-900">
            <p class="font-semibold">{form?.message}</p>
            {#if form?.aditional}
                <p class="text-sm">Campo: {capitalizeFirstLetter(form?.aditional[0].campo)}</p>               
                <p class="text-xs">{form?.aditional[0].validation}</p>
            {/if}
        </div>
    </div>   
{/if}
	