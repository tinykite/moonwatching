<script lang="ts">
	export let phase: any;
	import MoonIllustration from './MoonIllustration.svelte';
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
	}
</style>
