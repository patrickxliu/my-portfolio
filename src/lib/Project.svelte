<script>
    export let data = {};
    export let hLevel = 2;
</script>

<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <img src={data.image} alt="" />
    <p>
      {data.description}
    </p>
    <p>
      {data.year}
    </p>
</article>

<style>
    /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  gap: 1em; */

  article{
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 4;
  }

  h2{
    margin: 0;
  }
</style>