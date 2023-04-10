<script lang="ts">
	import { calendarYear2023 } from '$lib/consts';
	import * as astronomy from '$lib/astronomy-reference';
	import { calculatePhase } from '$lib/moon-utils';
	import { addHours } from 'date-fns';

	const getMoonPhase = ({ date }) => {
		const nextQuarter = astronomy.SearchMoonQuarter(date);
		const phase = calculatePhase({ nextQuarter, date });
		return phase;
	};

	let phases = [];

	for (let i = 0; i < calendarYear2023.length; i++) {
		let date = new Date(calendarYear2023[i]);

		let phase = getMoonPhase({ date });
		let ecliptic = astronomy.MoonPhase(date);

		phases.push({
			date: calendarYear2023[i].split('T')[0],
			phase,
			ecliptic,
			source: 'Astronomy Engine'
		});
	}
</script>

<h2>Phases for 2023</h2>
{#each phases as phase}
	<h3>{phase.date}</h3>
	<p>{phase.phase}</p>
	<p>{phase.ecliptic}</p>
{/each}
