<script>
  import * as d3 from "d3";

  import { onMount } from "svelte";

  import {
    computePosition,
    autoPlacement,
    offset,
  } from '@floating-ui/dom';

  import StackedBar from '$lib/StackedBar.svelte';
  import FileLines from "$lib/FileLines.svelte";
  import Scrolly from "svelte-scrolly";

  
  let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

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

    commits = d3.sort(commits, d => -d.totalLines);

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

  let commitProgress = 100;
  let raceProgress = 100;
  $: timeScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([0, 100])
                .nice();
  $: commitMaxTime = timeScale.invert(commitProgress);
  $: raceMaxTime = timeScale.invert(raceProgress)
  $: filteredCommits = commits.filter(commit => commit.datetime <= commitMaxTime)
  $: filteredLines = data.filter(line => line.datetime <= raceMaxTime)

  $: majorCommits = commits
  .filter(c => c.totalLines > 20 || new Set(c.lines.map(l => l.file)).size > 10)
  .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  $: xScale = d3.scaleTime()
                .domain([minDate, commitMaxTime])
                .range([usableArea.left, usableArea.right])
                .nice();

  $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);

  $: rScale = d3.scaleSqrt(d3.extent(filteredCommits, d=> d.totalLines), [2,25]);

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
  $: hoveredCommit = filteredCommits[hoveredIndex] ?? hoveredCommit ?? {};

  let cursor = {x: 0, y: 0};

  let commitTooltip;
  let tooltipPosition = {x: 0, y: 0};

  let clickedCommits = [];

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
    else if (evt.type === "click") {
      let commit = filteredCommits[index]
      if (!clickedCommits.includes(commit)) {
        // Add the commit to the clickedCommits array
        clickedCommits = [...clickedCommits, commit];
      }
      else {
          // Remove the commit from the array
          clickedCommits = clickedCommits.filter(c => c !== commit);
      }
    }
  }

  $: allTypes = Array.from(new Set(data.map(d => d.type)));
  $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : filteredCommits).flatMap(d => d.lines);
  $: selectedCounts = d3.rollup(
    selectedLines,
    v => v.length,
    d => d.type
  );
  $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);
  
</script>

<svelte:head>
  <title>Meta Statistics</title>
</svelte:head>

<h1 >
    Meta
</h1>
<h2>My GitHub Stats</h2>
<!-- <div class="slider-container">
  <label>
    Show commits until:
        <input bind:value={commitProgress} type="range" min="0" max="100" class="slider"/>
        <time style="display: block">
          {commitMaxTime.toLocaleString()}
        </time>
  </label>
</div> -->

<!-- <FileLines lines={filteredLines} width={width?? 1000} colorScale={colorScale}/> -->

<dl class="stats">
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
  <dt>Total Commits</dt>
  <dt>Files</dt>
	<dd>{data.length}</dd>
  <dd>{commits.length}</dd>
  <dd>{files.length}</dd>
</dl>

<h3>Commits by time of day</h3>


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

<Scrolly bind:progress={ commitProgress }>
  {#each majorCommits as commit, index }
    <p>
      On {commit.datetime.toLocaleString("en", {dateStyle: "full", timeStyle: "short"})},
      {index === 0 
        ? "I ported my portfolio and made my first commit to this repo for lab 4 when I ported my portfolio to Sveltekit."
        : ""}
      {index === 1
        ? "I made my first and only significant commit to lab 5 which focused on templating and control flow with svelte."
        : ""}
      {index === 2
        ? "I made one of two significant commits for lab 6 which focused on vizualizing categorical data with d3. This led to the pie charts on the projects page."
        : ""}
      {index === 3
        ? "I the second of two significant commits for lab 6."
        : ""}
      {index === 4
        ? "I made my first significant commit for lab 7 which focused on visualizing categorical data with d3. This led to the creation of this meta page."
        : ""}
      {index === 5
        ? "I made the second significant commit for lab 7. This was during the creation of the commits plot of the meta page."
        : ""}
      {index === 6
        ? "I made the last significant commit for lab 7. This added the original bar chart that was present on the meta page"
        : ""}
      {index === 7
        ? "I made a significant commit to lab 9 which focused on animation and scrolleytelling. This commit added the original functioning slider on the page."
        : ""}
      {index === 8
        ? "I made the second significant commit for lab 9. This commit removed the slider and instead added two scolleys. It also implemented the longest file race that is used in one of the scrolleys."
        : ""}
      This update transformed {commit.totalLines} lines across { d3.rollups(commit.lines, D => D.length, d => d.file).length } files. View the commit 
      <a href="{commit.url}" target="_blank">
        {index === 0 ? "here" : "here"}
      </a>.
    </p>
  {/each}
	<svelte:fragment slot="viz">
		<svg viewBox="0 0 {width} {height}">
      <!-- scatterplot will go here -->
      <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
      <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
      <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
      <g class="dots">
        {#each filteredCommits as commit, index (commit.id) }
          <circle
            class:selected={ clickedCommits.includes(commit) }
            on:click={ evt => dotInteraction(index, evt) }
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
            r={ rScale(commit.totalLines) }
            fill="steelblue"
            fill-opacity = ".8"
          />
        {/each}
      </g>
    </svg>
    <StackedBar data={languageBreakdown} width={width*.4} colorScale={colorScale} />
	</svelte:fragment>
</Scrolly>

<Scrolly bind:progress={raceProgress} --scrolly-layout="viz-first" --scrolly-viz-width="3fr">
	{#each majorCommits as commit, index }
    <p>
      On {commit.datetime.toLocaleString("en", {dateStyle: "full", timeStyle: "short"})},
      {index === 0 
        ? "I ported my portfolio and made my first commit to this repo for lab 4 when I ported my portfolio to Sveltekit."
        : ""}
      {index === 1
        ? "I made my first and only significant commit to lab 5 which focused on templating and control flow with svelte."
        : ""}
      {index === 2
        ? "I made one of two significant commits for lab 6 which focused on vizualizing categorical data with d3. This led to the pie charts on the projects page."
        : ""}
      {index === 3
        ? "I the second of two significant commits for lab 6."
        : ""}
      {index === 4
        ? "I made my first significant commit for lab 7 which focused on visualizing categorical data with d3. This led to the creation of this meta page."
        : ""}
      {index === 5
        ? "I made the second significant commit for lab 7. This was during the creation of the commits plot of the meta page."
        : ""}
      {index === 6
        ? "I made the last significant commit for lab 7. This added the original bar chart that was present on the meta page"
        : ""}
      {index === 7
        ? "I made a significant commit to lab 9 which focused on animation and scrolleytelling. This commit added the original functioning slider on the page."
        : ""}
      {index === 8
        ? "I made the second significant commit for lab 9. This commit removed the slider and instead added two scolleys. It also implemented the longest file race that is used in one of the scrolleys."
        : ""}
      This update transformed {commit.totalLines} lines across { d3.rollups(commit.lines, D => D.length, d => d.file).length } files. View the commit 
      <a href="{commit.url}" target="_blank">
        {index === 0 ? "here" : "here"}
      </a>.
    </p>
  {/each}
	<svelte:fragment slot="viz">
		<FileLines lines={filteredLines} svgWidth={width*.75} colorScale={colorScale}/>
	</svelte:fragment>
</Scrolly>








<style>
  :global(body){
    max-width: min(120ch, 80vw);
  }
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
    @starting-style {
      r: 0;
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
  .selected {
    fill: var(--color-accent);
  }
  /* .slider {
    width: 100vw;
    max-width: 100%;
    display: block;
  }
  time{
    text-align: right;
  } */
</style>