<script lang="ts">
	import { phase } from '$lib/stores';
	import { animate } from 'motion';
	import { lookupPhase } from '$lib/moon-utils';

	let dateInput: HTMLInputElement | null;
	let userDate: string;
	let error: boolean;
	let errorMessage: string;

	const validDateFormat = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$/;

	const onSubmitCustomDate = async () => {
		error = false;
		errorMessage = '';

		const currentDate = new Date()
		const dateParams = userDate.split('/');

		// Javascript months are zero-indexed. So January is 0
		const month = parseInt(dateParams[0]) - 1;
		const day = parseInt(dateParams[1]);
		const year = parseInt(dateParams[2]);

		// Date object will not accept a string literal as valid date arguments
		// Passing a full date string is not recommended
		const newDate = new Date()
		newDate.setFullYear(year)
		newDate.setMonth(month)
		newDate.setDate(day);

		if (!userDate) {
			error = true;
			errorMessage = 'Please enter a valid date';
			return;
		}

		if (newDate.getFullYear() !== currentDate.getFullYear()) {
			error = true;
			errorMessage = `Please enter a ${currentDate.getFullYear()} date`;
			return;
		}

		const {phase: newPhase, error: lookupError} = await lookupPhase(newDate)

		if (lookupError) {
			error = true;
			errorMessage = "There was an error looking up your date. Please try again."; // Finesse this
			return;
		}

		await animate('.illustrationContainer', { opacity: 0 }, { duration: 0.75 }).finished;
		phase.set(newPhase);
		animate('.illustrationContainer', { opacity: 1 }, { duration: 0.75 });
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
		<label for="date">2024 Date (MM/DD/YYYY)</label>
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
		text-align: left;
	}

	.custom-date-lookup__error {
		text-align: left;
		padding-block-start: 0.5rem;
	}
</style>
