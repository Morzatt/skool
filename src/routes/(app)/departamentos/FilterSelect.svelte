<script lang="ts">
    type Option = {
        name: string,
        value: string,
    }
    type Locations = 'top' | 'right' |'bottom'|'left'
    type DropDownTypes = `dropdown-${Locations}`

    let { value = $bindable(), options, styles, icon, type, name }:
    { 
        value: string,
        options: Option[], 
        styles?: string,
        icon?: string,
        type?: DropDownTypes,
        name: string,
    } = $props()

    let title = $state("")

    function changeValue(option: Option) {
        value = option.value;
        title = option.name;
        setTimeout(() => { document.getElementById(`dd_${name}`)!.attributes.removeNamedItem('open') }, 100)
    }
</script>

<details class="dropdown {type}" id={`dd_${name}`}>
    <summary class="btn btn-sm bg-primary-content text-base-100 m-1 px-5 {styles}">
        <i class="{icon}"></i>
        {title ? title : name}
    </summary>

    <ul class="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm">
        {#each options as option, i}
            <li>
                <button onclick="{() => {changeValue(option)}}">
                    <span>{option.name}</span>
                </button>
            </li> 
        {/each}
    </ul>
</details>