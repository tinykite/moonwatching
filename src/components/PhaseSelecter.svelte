<script lang="ts">
	import { phase } from '$lib/stores';
	import { animate } from 'motion';

	const phaseOptions = [
		'New Moon',
		'Waxing Crescent',
		'First Quarter',
		'Waxing Gibbous',
		'Full Moon',
		'Waning Gibbous',
		'Last Quarter',
		'Waning Crescent'
	];

	const updatePhase = async (newPhase: any) => {
		await animate('.illustrationWrapper', { opacity: 0 }, { duration: 0.75 }).finished;
		phase.set(newPhase);
		animate('.illustrationWrapper', { opacity: 1 }, { duration: 0.75 });
	};

	// Note: This component is used only for testing the transition between different phases
</script>

<div class="phaseGrid">
	{#each phaseOptions as phaseOption}
		<button
			onclick={() => {
				updatePhase(phaseOption);
			}}
		>
			{phaseOption}
		</button>
	{/each}
</div>

<style>
	.phaseGrid {
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	button {
		width: 100px;
		background: none;
		outline: 1px solid #fff;
		cursor: pointer;
	}
</style>
