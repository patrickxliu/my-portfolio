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
</script>

{
    JSON.stringify($page)
  }
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

<slot /> 