<script lang="ts">
	import { animate } from 'motion';
	export let phase: any;
	import MoonIllustration from './MoonIllustration.svelte';

	let illustrationRef: HTMLElement;

	$: if (phase && illustrationRef) {
		animate(illustrationRef, { opacity: 1 }, { duration: 0.5 });
	}
</script>

<div class="illustrationContainer" bind:this={illustrationRef}>
	<p class="u-visuallyHidden">Current Moon Phase: {phase}</p>
	<MoonIllustration {phase} />
</div>

<style>
	.illustrationContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		opacity: 0;
	}
</style>
