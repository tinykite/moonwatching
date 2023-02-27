<script lang="ts">
	import type { PageData } from '../$types';
	import { getFormattedTime } from '$lib/time';
	export let data: PageData;
	const moonPhases = data.moonPhases.map((phase) => {
		const time = getFormattedTime({ time: phase.time, timeFormat: phase.time_format });

		return {
			...phase,
			formattedTime: time
		};
	});
</script>

<!-- According to best practices, a page should only have one global aria-live region.  -->
<main aria-live="polite" class="main">
	{#each moonPhases as phase}
		<div class="phase">
			<h2 class="phase__title">{phase.date}</h2>
			<p class="phase__time">{phase.phase}</p>
			<p class="phase__time">{phase.time}</p>
			<p class="phase__time">{phase.formattedTime}</p>
		</div>
	{/each}
</main>
