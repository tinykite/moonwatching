<script lang="ts">
	import type { PageData } from './$types';
	import MoonPhase from '../components/MoonPhase.svelte';
	import DateInput from '../components/DateInput.svelte';
	import CurrentDate from '../components/CurrentDate.svelte';
	import { phase } from '$lib/stores';
	import { timeline } from 'motion';

	export let data: PageData;

	phase.set(data?.moon_phase);

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

<main class="pageMain">
	<MoonPhase phase={$phase} />
		<!-- <div class="dateContainer">
			<CurrentDate currentDate={data.moonPhase.date} handleToggle={() => toggleDateInput()} />
			<DateInput />
		</div> -->
</main>

<style>
	.pageMain {
		display: grid;
		margin: 6vh auto 0;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	@media (min-width: 1440px) {
		.pageMain {
			margin: 25vh auto 2rem;
		}
	}

	.pageMain__heading {
		font-family: 'swear-display', serif;
		font-size: 2rem;
		font-weight: 500;
	}

	.pageMain__text {
		margin-top: 1rem;
		max-width: 30rem;
		line-height: 1.5;
		font-size: 1rem;
		font-family: Avenir, 'Avenir Next LT Pro', Montserrat, Corbel, 'URW Gothic', source-sans-pro,
			sans-serif;
	}

	/* .dateContainer {
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
	} */
</style>
