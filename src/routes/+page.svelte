<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: FormDataEntryValue;
	import MoonPhase from '../components/MoonPhase.svelte';
	import MoonAlertForm from '../components/MoonAlertForm.svelte';
</script>

<main class="page-container">
	<MoonPhase phase={data.moonPhase} />
	<h2 class="alert-header">Get Email Updates on the Moon</h2>
	<MoonAlertForm {form} />
</main>

<style>
	.page-container {
		display: grid;
	}

	.alert-header {
		font-size: 1.25rem;
		margin: 3rem 0 0;
	}

	@media (min-width: 50rem) {
		.alert-header {
			margin: 6rem auto 0;
		}
	}
</style>
