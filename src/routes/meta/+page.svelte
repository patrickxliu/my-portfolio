<script>
  import * as d3 from "d3";

  import { onMount } from "svelte";

  import {
    computePosition,
    autoPlacement,
    offset,
  } from '@floating-ui/dom';

  let data = [];
  let commits = [];
  let files = [];

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

    files= d3.groups(data, d => d.file)

  });
  
  let width = 1000, height = 600;
  let margin = {top: 10, right: 10, bottom: 30, left: 20};

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  $: minDate = d3.min(commits.map(d => d.date));
  $: maxDate = d3.max(commits.map(d => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  $: xScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([usableArea.left, usableArea.right])
                .nice();

  $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);

  let xAxis, yAxis, yAxisGridlines;

  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale)
        .tickFormat("")
        .tickSize(-usableArea.width)
    );
  }

  let hoveredIndex = -1;
  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

  let cursor = {x: 0, y: 0};

  let commitTooltip;
  let tooltipPosition = {x: 0, y: 0};

  async function dotInteraction (index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      cursor = {x: evt.x, y: evt.y};
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed", // because we use position: fixed
        middleware: [
          offset(5), // spacing from tooltip to dot
          autoPlacement() // see https://floating-ui.com/docs/autoplacement
        ],
      });        }
    else if (evt.type === "mouseleave") {
      hoveredIndex = -1
    }
  }
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
  <dt>Files</dt>
	<dd>{data.length}</dd>
  <dd>{commits.length}</dd>
  <dd>{files.length}</dd>
</dl>

<h3>Commits by time of day</h3>
<svg viewBox="0 0 {width} {height}">
	<!-- scatterplot will go here -->
  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
  <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  <g class="dots">
    {#each commits as commit, index }
      <circle
        on:mouseenter={evt => dotInteraction(index, evt)}
        on:mouseleave={evt => dotInteraction(index, evt)}
        on:mouseenter={evt => {
          hoveredIndex = index;
          cursor = {x: evt.x, y: evt.y};
        }}
        on:mouseenter={evt => hoveredIndex = index}
        on:mouseleave={evt => hoveredIndex = -1}
        cx={ xScale(commit.datetime) }
        cy={ yScale(commit.hourFrac) }
        r="5"
        fill="steelblue"
      />
    {/each}
  </g>
</svg>

<dl class="info tooltip" hidden={hoveredIndex === -1} style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px" bind:this={commitTooltip}>
    <dt class="info">COMMIT</dt>
    <dd class="info"><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>
  
    <dt class="info">DATE</dt>
    <dd class="info">{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt class="info">TIME</dt>
    <dd class="info">{ hoveredCommit.time?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt class="info">AUTHOR</dt>
    <dd class="info">{ hoveredCommit.author?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt class="info">LINES</dt>
    <dd class="info">{ hoveredCommit.totalLines?.toLocaleString("en", {dateStyle: "full"}) }</dd>
    <!-- Add: Time, author, lines edited -->
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
  svg {
		overflow: visible;
	}
  .gridlines {
    stroke-opacity: .2;
  }

  dl.info{
    display: grid;
    grid-template-columns: 3em 12em;
    grid-template-rows: 1em,1em;
    text-decoration: none;
    margin: 0%;
    padding: 1em;
    border-radius: 5px;
    border-style: solid;
    border-color: gray;
    background-color: oklch(100% 0% 0 / 80%);
    backdrop-filter: blur(5px);

    transition-duration: 500ms;
    transition-property: opacity, visibility;

    &[hidden]:not(:hover, :focus-within) {
      opacity: 0;
      visibility: hidden;
    }
  }

  .tooltip{
    position: fixed;
    top: 1em;
    left: 1em;
  }
  circle {
    transition: 200ms;
    transform-origin: center;
    transform-box: fill-box;

    &:hover {
      transform: scale(1.5);
    }
  }

  dt.info{
      text-align: right;
      font-size:x-small;
      font-weight:lighter;
  }
  dd.info{
      text-align: left;
      font-size: x-small;
      font-weight: normal;

  }
</style>