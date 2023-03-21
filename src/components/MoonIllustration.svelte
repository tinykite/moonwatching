<script lang="ts">
	export let phase: any;
	import NewMoon from './illustrations/NewMoon.svelte';
	import WaxingCrescent from './illustrations/WaxingCrescent.svelte';
	import FirstQuarter from './illustrations/FirstQuarter.svelte';
	import WaxingGibbous from './illustrations/WaxingGibbous.svelte';
	import FullMoon from './illustrations/FullMoon.svelte';
	import WaningGibbous from './illustrations/WaningGibbous.svelte';
	import LastQuarter from './illustrations/LastQuarter.svelte';
	import WaningCrescent from './illustrations/WaningCrescent.svelte';
</script>

{#if phase === 'New Moon'}
	<NewMoon />
{:else if phase === 'Waxing Crescent'}
	<WaxingCrescent />
{:else if phase === 'First Quarter'}
	<FirstQuarter />
{:else if phase === 'Waxing Gibbous'}
	<WaxingGibbous />
{:else if phase === 'Full Moon'}
	<FullMoon />
{:else if phase === 'Waning Gibbous'}
	<WaningGibbous />
{:else if phase === 'Last Quarter' || phase === 'Third Quarter'}
	<LastQuarter />
{:else if phase === 'Waning Crescent'}
	<WaningCrescent />
{/if}
