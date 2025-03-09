<script lang="ts">
    type Option = {
        name: string,
        value: string,
    }
    type Locations = 'top' | 'right' |'bottom'|'left'
    type DropDownTypes = `dropdown-${Locations}`

    let { options, styles, icon, type, placeholder, name}:
    { 
        options: Option[], 
        styles?: string,
        icon?: string,
        type?: DropDownTypes,
        name: string,
        placeholder: string
    } = $props()

    let value = $state()

    function changeValue(option: Option) {
        placeholder = option.name;
        value = option.value;

        setTimeout(() => { document.getElementById(`dd_${name}`)!.attributes.removeNamedItem('open') }, 100)
    }
</script>

<details class="dropdown {type}" id={`dd_${name}`}>
    <summary class="btn btn-sm bg-base-content text-base-100 m-1 px-5 flex items-center justify-start w-fit {styles}">
        <i class="{icon}"></i>
        {placeholder}
    </summary>

    <input type="hidden" name="{name}" bind:value={value}>

    <ul class="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
        {#each options as option}
            <li>
                <button type="button" onclick="{() => {changeValue(option)}}">
                    <span>{option.name}</span>
                </button>
            </li> 
        {/each}
    </ul>
</details>