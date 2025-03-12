<script>
    import { page } from "$app/stores";


    let pages = [
  { url: "./", title: "Home" },
  { url: "./projects", title: "Projects" },
  { url: "./contact", title: "Contact" },
  { url: "./resume", title: "Resume"},
  { url: "https://github.mit.edu/pxliu", title: "Github"},
  // add the rest of your pages here
];
</script>

{
    JSON.stringify($page)
  }
<nav>
    {#each pages as p}
    <a href="{p.url}">{p.title}</a>
    {/each}
</nav>

<slot /> 