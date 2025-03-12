<script>
    import { page } from "$app/stores";


    let pages = [
        {url: "https://patrickxliu.github.io/my-portfolio/", title: "Home"},
        {url: "https://patrickxliu.github.io/my-portfolio/projects/", title: "Projects"},
        {url: "https://patrickxliu.github.io/my-portfolio/contact/", title: "Contact"},
        {url: "https://patrickxliu.github.io/my-portfolio/resume/", title: "Resume"},
        {url: "https://github.mit.edu/pxliu", title: "Github"}
    // add the rest of your pages here
    ];

    let colorScheme = "light dark";
</script>

<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>

<nav>
    {#each pages as p}
    <a href={p.url}
    class:current={$page.url == p.url}
    target={p.url.endsWith("pxliu") ? "_blank" : null}
    >
        {p.title}
    </a>
    {/each}
</nav>
{colorScheme}
<slot /> 

<style>
    nav{
        --border-color: oklch(50% 10% 200 / 40%);
        display: flex;
        margin-bottom: 25px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: var(--border-color);
  
        
    }
    a{
            flex: 1;
            text-decoration: none;
            color: inherit;
            text-align: center;
            padding: .5em;
            
        }

    a.current{
        font-weight: bold;
        border-bottom: .2em solid var(--color-accent);
    }

    a:hover{
        border-bottom: .2em solid var(--color-accent);
        background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
    }

    label.color-scheme{
        display: inline-flex;
        gap: 4px;
        position: absolute;
        top: 2rem;
        right: 2rem;
        font-family: inherit;
        font-size: 80%;
    }
</style>