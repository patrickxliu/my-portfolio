
<svelte:head>
  <title>Projects</title>
</svelte:head>

<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';
    import * as d3 from 'd3';

    let rolledData = d3.rollups(projects, v => v.length, d => d.year);
    let pieData = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let query = "";
    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
	    return values.includes(query.toLowerCase());
    });

</script>


<h1>
    {projects.length} Projects
</h1>

<Pie data={pieData}/>

<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…"
/>

<div class="projects">
    {#each filteredProjects as p}
    <Project data={p} />
    {/each}
</div>

<style>
    input{
        width: 100%;
        margin: 1em;
    }
</style>