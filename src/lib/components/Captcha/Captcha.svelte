<script lang="ts">
    import { onMount } from "svelte";
    import renew_icon from "$lib/images/icons/renew_icon.svg"

    let { text, data, invalidate, result = $bindable() }: { 
        text: string, 
        data: string, 
        invalidate: (...args: any) => Promise<any>,
        result: boolean 
    } = $props()

    let submit: HTMLInputElement;
    let key: HTMLElement;

    function generate() {
        submit.value = "";
        result = false;
        invalidate()
    }

    function check() {
        const usr_input = submit.value;
        if (usr_input == text) {
            result = true;
        } else {
            result = false;
        }
    }

    onMount(() => {
        submit = document.getElementById("submit") as HTMLInputElement
        key = document.getElementById("key") as HTMLElement 
    })
</script>

<div class="w-full min-h-20 p-3
            border border-base-content/20 rounded-xl
            bg-base-content
            flex flex-col gap-3">
    <div class="bg-base-100 border-b rounded-md py-3 px-5 border-base-content/20 w-full flex justify-end items-center">
        <div id="image" class=" w-full text-3xl italic line-through select-none relative">
            {@html data}
        </div>

        <div class="border border-base-content/20 
                    rounded-md flex items-center justify-center cursor-pointer">
            <button type="button" class="size-7 flex items-center justify-center p-0.5
            hover:bg-base-content/10 active:bg-transparent rounded-md transition-all" onclick="{generate}">
                <img src="{renew_icon}" alt="" class="size-full">
            </button>
        </div>
    </div>

    <input 
        class="w-full rounded-md h-full p-2 focus:border-transparent focus:outline-0 input-sm" 
        type="text" 
        id="submit" 
        placeholder="Código Captcha"
        oninput="{check}"/>
</div>