<script>
  import * as d3 from "d3";

  import { onMount } from "svelte";

  let data = [];
  let commits = [];

  onMount(async () => {
    data = await d3.csv("images/loc.csv", row => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime)
    }));

    commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
      let first = lines[0];
      let {author, date, time, timezone, datetime} = first;
      let ret = {
        id: commit,
        url: "https://github.com/patrickxliu/my-portfolio/commit/" + commit,
        author, date, time, timezone, datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length
      };

      // Like ret.lines = lines
      // but non-enumerable so it doesn’t show up in JSON.stringify
      Object.defineProperty(ret, "lines", {
        value: lines,
        configurable: true,
        writable: true,
        enumerable: false,
      });

      return ret;
    });
  });
  
  console.log(commits);
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

<h2>My GitHub Stats</h2>
<dl class="stats">
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
  <dt>Total Commits</dt>
  <dt>haha</dt>
	<dd>{data.length}</dd>
  <dd>{commits.length}</dd>
  <dt>weeeee</dt>
</dl>


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