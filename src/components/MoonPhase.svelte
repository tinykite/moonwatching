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
		/* display: flex;
		justify-content: center; */
		/* align-items: center; */
		margin: 0 auto;
		width: 80%;
		max-width: 450px;
	}

	@media (min-width: 64.25rem) {
		.illustrationWrapper {
			width: 450px;
		}
	}

	@media (min-width: 90rem) {
		.illustrationWrapper {
			max-width: 100%;
			width: 20vw;
		}
	}
</style>
