<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	import MoonPhase from '../MoonPhase.svelte';
	import MoonAlertForm from '../MoonAlertForm.svelte';

	export let form;
</script>

<MoonPhase phase={data.moonPhase} />
<MoonAlertForm {form} />

<style>
	:global(body) {
		color: white;
	}
</style>
