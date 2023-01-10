<script lang="ts">
	export let phase: any;
	import MoonIllustration from './MoonIllustration.svelte';
</script>

<div class="moon-container">
	<p class="sr-only">Current Moon Phase: {phase}</p>
	<MoonIllustration {phase} />
</div>

<style>
	.moon-container {
		display: flex;
		justify-content: center;
		height: 50vh;
	}

	.sr-only {
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
		-webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
		white-space: nowrap;
	}
</style>
