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
<img src="images/headshot.JPG" height="400" alt="A professional headshot of me in a suit and glasses.">

<h2>Latest Projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data={p} hLevel="3"/>
    {/each}
</div>
