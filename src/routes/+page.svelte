<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    import { onMount } from "svelte";

    let githubData = null;
    let loading = true;
    let error = null;

    onMount(async () => {
      try {
        const response = await fetch("https://api.github.com/users/patrickxliu");
        githubData = await response.json();
      } catch (err) {
        error = err;
      }
      loading = false;
    });
</script>

<h1 class="home">
    Patrick Liu
</h1>
<p>
    Senior studying computer science at MIT. Ask me about fencing, basketball, or video games!
</p>
<img src="images/headshot.JPG" height="400" alt="A professional headshot of me in a suit and glasses.">

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p class="error">Something went wrong: {error.message}</p>
{:else}
    <section>
        <h2>My GitHub Stats</h2>
        <dl>
            <dt>Followers</dt>
            <dt>Public Repositories</dt>
            <dt>Following</dt>
            <dd>{githubData.following}</dd>
            <dd>{githubData.followers}</dd>
            <dd>{githubData.public_repos}</dd>
        </dl>
    </section>
{/if}

<h2>Latest Projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data={p} hLevel="3"/>
    {/each}
</div>

<style>
    dl{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1em,2em;
        text-decoration: none;
    }
    dt{
        text-align: left;
        font-size: small;
    }
    dd{
        text-align: left;
        font-size: x-large;
        font-weight: lighter;
    }
</style>
