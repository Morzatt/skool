<script lang="ts">
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

    // Images Import
    import success_icon from "$lib/images/icons/success_icon.svg"

    let { form, styles } = $props()
    let visible = $state(false)

    $effect(() => {
        if (form?.success === true) {
            visible = true;
            setTimeout(() => {
                visible = false;
            }, 10000)
        }
    })
</script>

{#if visible}
    <div  role="alert" class="alert alert-success {styles}" 
    transition:slide={{ duration: 100, easing: sineInOut, axis: "x" }}>
        <img src="{success_icon}" alt="" class="filter invert">
        <div class="block">
            <p class="font-semibold text-gray-50">{form?.message}</p>
        </div>
    </div>   
{/if}