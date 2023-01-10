<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: FormDataEntryValue;
	import MoonPhase from '../components/MoonPhase.svelte';
	import MoonAlertForm from '../components/MoonAlertForm.svelte';
</script>

<MoonPhase phase={data.moonPhase} />
<MoonAlertForm {form} />
