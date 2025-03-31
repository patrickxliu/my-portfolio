<script>
  import * as d3 from "d3";

  import { onMount } from "svelte";

  let data = [];

  onMount(async () => {
    data = await d3.csv("static/loc.csv");
  });
</script>

<svelte:head>
  <title>Meta Statistics</title>
</svelte:head>

<h1 >
    Meta
</h1>
<p>
    Hello World!
</p>

<p>Total lines of code: {data.length}</p>