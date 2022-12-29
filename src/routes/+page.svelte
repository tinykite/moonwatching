<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	import MoonPhase from '../MoonPhase.svelte';
</script>

<MoonPhase phase={data.moonPhase} />
