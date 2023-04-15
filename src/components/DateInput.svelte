<script lang="ts">
	import { indeterminateDate } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import * as astronomy from '$lib/astronomy-reference';
	import { phase } from '$lib/stores';
	import { calculatePhase } from '$lib/moon-utils';
	import { animate } from 'motion';

	let dateInput: HTMLInputElement | null;
	let userDate: string;
	let error: boolean;
	let errorMessage: string;

	const validDateFormat = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$/;

	const onSubmitCustomDate = async () => {
		error = false;
		errorMessage = '';
		const date = new Date(userDate);

		if (!date) {
			error = true;
			errorMessage = 'Please enter a valid date';
			return;
		}

		const nextQuarter = astronomy.SearchMoonQuarter(date);
		const newPhase = calculatePhase({ nextQuarter, date });

		await animate('.illustrationWrapper', { opacity: 0 }, { duration: 0.75 }).finished;
		phase.set(newPhase);
		animate('.illustrationWrapper', { opacity: 1 }, { duration: 0.75 });
	};

	$: if (userDate && validDateFormat.test(userDate)) {
		onSubmitCustomDate();
	}

	const onSubmit = (e: Event) => {
		e.preventDefault();

		if (validDateFormat.test(userDate)) {
			onSubmitCustomDate();
		} else {
			error = true;
			errorMessage = 'Please enter a date in the format MM/DD/YYYY';
		}
	};
</script>

<form
	class="dateInputContainer"
	on:submit={(event) => {
		onSubmit(event);
	}}
>
	<div class="input-group">
		<label for="date">Date (MM/DD/YYYY)</label>
		<input
			bind:this={dateInput}
			type="text"
			id="date"
			class="form__input"
			bind:value={userDate}
			required
			title="Please enter a date in the format MM/DD/YYYY"
			pattern={String.raw`^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$`}
			maxLength={10}
		/>
	</div>
</form>
{#if error}
	<p class="custom-date-lookup__error">{errorMessage}</p>
{/if}

<style>
	.dateInputContainer {
		display: flex;
		justify-content: center;
		grid-row: 1;
		grid-column: 1 / 1;
		transform: translateX(100%);
		opacity: 0;
	}

	.input-group {
		display: flex;
		flex-direction: column;
	}
</style>
