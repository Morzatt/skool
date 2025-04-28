<script lang="ts">
    import { enhance } from "$app/forms";
    import school_logo from "$lib/images/logo.png"

    let { empleado, qr }: {empleado: any, qr: string} = $props()

    let colors = ['#bc9850', '#002232', '#ce5f38', '#8f4927','#f97d1e', '#81a4e0','#2c599d']

    let bgColor = $state('')
</script>

{#snippet card()}
    <div class="card relative bg-white w-[22rem] border border-base-content">
        <div class="p-4 bg-[--color] absolute top-2 left-[50%] translate-x-[-50%] rounded-full" style="--color: {bgColor}"></div>

        <div class="p-1 bg-[--color] absolute top-2 left-2 rounded-full" style="--color: {bgColor}">
            <img src="{school_logo}" alt="" class="join-ite size-12 p-0 bg-white rounded-full"/> 
        </div>

        <figure class="px-10 pt-10 mt-8">
            <div class="size-[15rem] animate-pop border-2 border-base-content rounded-xl p-3 bg-[--color]" style="--color: {bgColor}">
                <img src="{qr}" alt="" class="size-full rounded-xl">
            </div> 
        </figure>

        <div class="card-body py-4 pb-6">
            <div class="w-full leading-tight {bgColor ? `bg-[--color] text-base-100` : "bg-transparent text-base-content"} px-2 py-1 rounded-md" style="--color: {bgColor}">
                <h2 class="card-title justify-center items-center">{empleado.primer_nombre} {empleado.primer_apellido}</h2>
                <p class="text-sm flex justify-center items-center gap-2">
                    <b>C.I: </b>
                    {empleado.nacionalidad ? empleado.nacionalidad == "Venezolano" ? "V-" : "E-" : "V-"}
                    {empleado.cedula}
                </p>
            </div>


            <div class="mt-2 leading-tight">
                <p class="text-sm"><b>Area:</b> {empleado.nombre_departamento}</p>
                <p class="text-sm"> <b>Cargo: </b> {empleado.cargo}</p>
            </div>
        </div>
    </div>
{/snippet}

<dialog id="create_ID_card" class="modal modal-ope modal-bottom sm:modal-middle">
    <div class="modal-box relative bg-base-300 flex flex-col items-center justify-center
                sm:w-10/12 sm:max-w-lg overflow-hidden">

        <form method="dialog">
            <button type="submit" id="create_ID_card" aria-label="close-modal" 
            class="hover:text-error transition-all duration-200 ease-in-out absolute top-4 right-4">
                <i class="fa-solid fa-circle-xmark text-3xl"></i>
            </button>
        </form>

        <h3 class="text-xl font-bold mt-3 text-center">Crear Tarjeta de Identificación</h3>

        <div class="w-full mt-2 overflow-y-auto
                    flex flex-col gap-3 items-center justify-start">            
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Escoger Color</b>
                </div>
                <div class="min-h-12 w-full flex items-center justify-center flex-wrap gap-3">
                    {#each colors as color}
                        <input type="radio" 
                            class="radio radio-mine border border-base-content rounded-full p-3"
                            style="--fallback-p: {color}"
                            name="bg_color"
                            onclick={()=> {bgColor = color}}/>
                    {/each}
                </div>
            </div>

            <div id="IDCard">
                {@render card()}
            </div>



            <form action="?/downloadID" method="post" use:enhance>
                <input type="hidden" name="cedula" value='{empleado.cedula}'>
                <input type="hidden" name="color" value='{bgColor}'>

                <button type="submit" 
                    class="btn btn-sm btn-success text-base-100 px-12">
                    Crear
                </button>
            </form>
        </div>
    </div>
</dialog>

<style>
    @media (hover:hover) {
        .radio-mine:hover {
            --tw-border-opacity: 1;
            border-color: var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)));
        }
    }
    .radio-mine {
        --chkbg: var(--p);
        --tw-border-opacity: 1;
        border-color: var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)));
    }
    .radio-mine:focus-visible {
        outline-color: var(--fallback-p,oklch(var(--p)/1));
    }

    .radio-mine:checked,
        .radio-mine[aria-checked="true"] {
        --tw-border-opacity: 1;
        border-color: var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)));
        --tw-bg-opacity: 1;
        background-color: var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)));
        --tw-text-opacity: 1;
        color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));
    }

    .radio-mine:checked,
        .radio-mine[aria-checked="true"] {
        --tw-border-opacity: 1;
        border-color: var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)));
        --tw-bg-opacity: 1;
        background-color: var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)));
        --tw-text-opacity: 1;
        color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));
    }
</style>