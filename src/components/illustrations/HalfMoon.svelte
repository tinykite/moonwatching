<script lang="ts">
	export let variant: string;
	export let size: number;
	const color = variant === 'light' ? '#d1d1d1' : '#000E24';
	const iconSize = size ? size : 48;
</script>

<svg
	width={iconSize}
	height={iconSize}
	viewBox={`0 0 ${iconSize} ${iconSize}`}
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<clipPath id="moonClip">
			<circle r={iconSize / 2} cx={iconSize / 2} cy={iconSize / 2} />
		</clipPath>
	</defs>
	<circle
		r={(iconSize - 2) / 2}
		cx={iconSize / 2}
		cy={iconSize / 2}
		stroke={color}
		stroke-width="2"
		clip-path="url(#moonClip)"
	/>
	<rect
		fill={color}
		x={iconSize / 2}
		y={0}
		width={iconSize}
		height={iconSize}
		clip-path="url(#moonClip)"
	/>
</svg>
