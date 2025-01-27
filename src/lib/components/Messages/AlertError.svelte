<script lang="ts">
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

    // Images Import
    import error_icon from "$lib/images/icons/error_icon.svg"

    let { form, styles } = $props()
    let visible = $state(false)

    $effect(() => {
        if (form?.success === false) {
            visible = true;
            setTimeout(() => {
                visible = false;
            }, 10000)
        }
    })
</script>

{#if visible}
    <div  role="alert" class="alert alert-error {styles}" transition:slide={{ duration: 100, easing: sineInOut, axis: "x" }}>
        <img src="{error_icon}" alt="">
        <div class="block">
            <p class="font-semibold text-red-950">{form?.message}</p>
        </div>
    </div>   
{/if}
	