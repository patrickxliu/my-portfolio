<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arc = arcGenerator({
	startAngle: 0,
	endAngle: 2 * Math.PI
});


</script>

<svg viewBox="-50 -50 100 100">
    <path d={arc} fill="red" />
</svg>