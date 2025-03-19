<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);


    export let data = [];
    let sliceGenerator = d3.pie().value(d => d.value);

    let arcData;
    let arcs;
    $: {
        // Reactively calculate arcData and arcs the same way we did before with sliceGenerator and arcGenerator
        arcData = sliceGenerator(data);
        arcs = arcData.map(d => arcGenerator(d));
    }

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    export let selectedIndex = -1;

</script>

<div class="container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <path d={arc} fill={ colors(index) }
                class:selected={selectedIndex === index}
                on:click={e => selectedIndex = selectedIndex === index ? -1 : index} />
        {/each}
    </svg>
    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }">
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>


<style>
    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    } 

    svg:has(path:hover) path:not(:hover) {
	    opacity: 50%;
    }

    svg:has(.selected) path:not(.selected) {
        opacity: 50%;
    }

    .selected {
        --color: oklch(60% 45% 0) !important;
        
        &:is(path) {
            fill: var(--color) !important;
        }
        
        &:is(li) {
            color: var(--color);
        }
    }

    path {
        transition: 300ms;
    }
    path:hover {
        opacity: 100% !important;
    }

    span.swatch{
        display: inline-block;
        width: 1em;
        height: 1em;
        background-color: var(--color);
        
    }
    ul.legend{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
        border: 1px solid black;
        padding: .5em;
        margin: .5em;
        flex: 1;
        height: fit-content;
        width: fit-content;
    }

    ul:has(.selected) li:not(.selected) {
        color: gray;
    }

    li{
        display: flex;
        align-items: center;
        gap: .25em;
    }

    .container{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>