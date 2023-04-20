<script lang="ts">
	import type { PageData } from './$types';
	import MoonPhase from '../components/MoonPhase.svelte';
	import { getBackgroundColorScales, interpolate } from '$lib/math-utils';
	import Color from 'colorjs.io';
	import { backgroundColor } from '$lib/stores';
	import { browser } from '$app/environment';
	import DateInput from '../components/DateInput.svelte';
	import CurrentDate from '../components/CurrentDate.svelte';
	import { phase } from '$lib/stores';
	import { animate, timeline } from 'motion';

	export let data: PageData;

	phase.set(data.moonPhase.phase);

	const { eclipticDomain, lightnessRange } = getBackgroundColorScales(
		data.moonPhase.ecliptic_longitude
	);

	const backgroundOffset = interpolate({
		domain: eclipticDomain,
		range: lightnessRange,
		value: data.moonPhase.ecliptic_longitude
	});
	const color = new Color('#001D4A');
	color.lch.l *= backgroundOffset;
	backgroundColor.set(color.toString({ format: 'hex' }));

	$: if (browser && phase) {
		document.body.style.backgroundColor = $backgroundColor;
		animate('.illustrationWrapper', { opacity: 1 }, { duration: 1 });
	}

	const toggleDateInput = () => {
		timeline([
			['.currentDateContainer', { transform: 'translateX(-100%)', opacity: 0 }, { duration: 0.5 }],
			[
				'.dateInputContainer',
				{ transform: 'translateX(0)', opacity: 1 },
				{ duration: 0.5, at: '-0.5 }' }
			]
		]);
	};
</script>

<main class="moonContainer">
	<MoonPhase phase={$phase} />

	<div class="dateContainer">
		<CurrentDate currentDate={data.moonPhase.date} handleToggle={() => toggleDateInput()} />
		<DateInput />
	</div>
</main>

<style>
	.moonContainer {
		display: grid;
		margin: 6vh auto 0;
		align-items: center;
	}

	@media (min-width: 1440px) {
		.moonContainer {
			margin: 12vh auto 2rem;
		}
	}

	.dateContainer {
		margin: 3rem auto;
		display: grid;
		position: relative;
		width: max-content;
		height: max-content;
		overflow: hidden;
	}

	@media (min-width: 1441px) {
		.dateContainer {
			margin-top: 4rem;
		}
	}
</style>
