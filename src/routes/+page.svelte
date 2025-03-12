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

{#await fetch("https://api.github.com/users/patrickxliu") }
<p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl>
            <dt>Followers:</dt>
            <dt>Following:</dt>
            <dt>Public Repositories:</dt>
            <dd>{data.followers}</dd>
            <dd>{data.following}</dd>
            <dd>{data.public_repos}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}

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
