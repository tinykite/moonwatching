<script lang="ts">
	export let phase: any;
	import MoonIllustration from './MoonIllustration.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const illustrationWrapper = document.querySelector('.illustrationWrapper') as HTMLElement;
		illustrationWrapper.style.opacity = '1';
	});
</script>

<div class="illustrationWrapper">
	<p class="sr-only">Current Moon Phase: {phase}</p>
	<MoonIllustration {phase} />
</div>

<style>
	.illustrationWrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		opacity: 0;
		transition: opacity 1s ease-in;
	}
</style>
