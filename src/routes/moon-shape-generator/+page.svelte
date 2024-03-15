<script lang="ts">
	import * as flubber from 'flubber';
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import { getMoonPath } from '$lib/creative-utils';
	import type { PageData } from './$types';
	import { max } from 'd3-array';

	export let data: PageData;

	let flubberInterpolate = flubber.interpolate ?? flubber.default.interpolate;

	let moonPhaseMask: SVGPathElement;
	let moonIllustrationRef: SVGSVGElement;
	let moonContainer: HTMLElement;

	const steps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

	let startPhase = 'Full Moon';
	let endPhase = 'Full Moon';
	let step = steps[0];

	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const getMoonData = (month) => {
		const allPhases = data.all_phases.filter(
			(phase) => phase.month === month && phase.moon_phase === endPhase
		);

		return allPhases.length;
	};

	let monthData = [1];

	const updatePhaseCount = () => {
		monthData = months.map((month) => {
			return getMoonData(month);
		});
	};

	const moonPhaseOptions = [
		{
			slug: 'fullMoon',
			name: 'Full Moon'
		},
		{
			slug: 'waxingCrescent',
			name: 'Waxing Crescent'
		},
		{
			slug: 'waningCrescent',
			name: 'Waning Crescent'
		},
		{
			slug: 'newMoon',
			name: 'New Moon'
		},
		{
			slug: 'firstQuarter',
			name: 'First Quarter'
		},
		{
			slug: 'lastQuarter',
			name: 'Last Quarter'
		},
		{
			slug: 'waningGibbous',
			name: 'Waning Gibbous'
		},
		{
			slug: 'waxingGibbous',
			name: 'Waxing Gibbous'
		}
	];

	onMount(() => {
		animate('.moon', { opacity: 1 }, { duration: 1 });
	});

	const interpolateShape = () => {
		const oldPath = getMoonPath(startPhase);
		const newPath = getMoonPath(endPhase);
		const mixPaths = flubberInterpolate(oldPath, newPath, {
			maxSegmentLength: 0.1
		});

		animate(() => moonPhaseMask.setAttribute('d', mixPaths(step)), { duration: 0.3 });
	};
</script>

<main class="pageMain">
	<div class="moonContainer" bind:this={moonContainer}>
		<div class="moonGroup">
			<svg bind:this={moonIllustrationRef} viewBox="0 0 200 200" class="moon" aria-hidden="true">
				<defs>
					<clipPath id="moonPhase">
						<path bind:this={moonPhaseMask} d={getMoonPath(startPhase)} />
					</clipPath>
				</defs>

				<circle fill="#FFFFFF" clip-path="url(#moonPhase)" r="100" cy="100" cx="100" />
			</svg>
		</div>
	</div>

	<h1>Moon Shape Generator</h1>
	<p>Max days per phase during a lunar cycle: {max(monthData)}</p>

	<label for="start_phase">Starting Phase</label>
	<select name="start_phase" id="start_phase" bind:value={startPhase}>
		{#each moonPhaseOptions as phaseOption}
			<option value={phaseOption.name}>{phaseOption.name}</option>
		{/each}
	</select>

	<label for="end_phase">Ending Phase</label>
	<select
		name="end_phase"
		id="end_phase"
		bind:value={endPhase}
		on:change={() => updatePhaseCount()}
	>
		{#each moonPhaseOptions as phaseOption}
			<option value={phaseOption.name}>{phaseOption.name}</option>
		{/each}
	</select>

	<label for="step">Step</label>
	<select name="step" id="step" bind:value={step}>
		{#each steps as step}
			<option value={step}>{step * 10}</option>
		{/each}
	</select>

	<button on:click={() => interpolateShape()}>Morph</button>
</main>

<style>
	.pageMain {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 2rem;
		margin: 4rem auto;
		align-items: center;
		width: 80%;
	}

	@media (min-width: 48rem) {
		.pageMain {
			max-width: 40rem;
			margin: 6rem auto;
		}
	}
	.moonContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	@media (min-width: 48rem) {
		.moonContainer::before {
			width: 50vh;
			height: 50vh;
		}
	}

	.moonGroup {
		display: grid;
		justify-items: center;
		align-items: center;
		width: 100%;
		position: relative;
	}

	.moon {
		width: 80%;
		opacity: 0;
	}

	@media (min-width: 48rem) {
		.moon {
			max-height: 50vh;
		}
	}
</style>
