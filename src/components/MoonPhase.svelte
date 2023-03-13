<script lang="ts">
	export let phase: any;
	import MoonIllustration from './MoonIllustration.svelte';
</script>

<p class="sr-only">Current Moon Phase: {phase}</p>
<MoonIllustration {phase} />
