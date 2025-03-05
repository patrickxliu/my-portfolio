<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
</script>

<h1 class="home">
    Patrick Liu
</h1>
<p>
    Senior studying computer science at MIT. Ask me about fencing, basketball, or video games!
</p>

<div class="projects">
    <h2>Latest Projects</h2>

    <img src="images/headshot.JPG" height="400" alt="A professional headshot of me in a suit and glasses.">
    {#each projects.slice(0, 3) as p}
        <Project data={p} />
    {/each}
</div>
