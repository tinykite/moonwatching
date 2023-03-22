<script lang="ts">
	import { indeterminateDate } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import * as astronomy from '$lib/astronomy-reference';
	import { format } from 'date-fns';
	import { phase } from '$lib/stores';
	import { getCurrentQuarter, getPreviousQuarter } from '$lib/moon-utils';

	// let dateForm: HTMLElement | null;
	let dateInput: HTMLInputElement | null;
	let userDate: string;
	let error: boolean;
	let errorMessage: string;

	const validDateFormat = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$/;

	const calculatePhase = ({ nextQuarter, date }: { nextQuarter: any; date: any }) => {
		const { quarter, time } = nextQuarter;

		const nextQuarterDate = format(time.date, 'MM/dd/yyyy');
		const currentDate = format(date, 'MM/dd/yyyy');

		// If the next quarter is the same day as the current date, return the current quarter
		if (nextQuarterDate === currentDate) {
			return getCurrentQuarter(quarter);
		}

		return getPreviousQuarter(quarter);
	};

	const onSubmitCustomDate = () => {
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

		phase.set(newPhase);
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

{#if $indeterminateDate}
	<form
		class="custom-date-lookup"
		transition:fade
		on:submit={(event) => {
			onSubmit(event);
		}}
	>
		<div class="input-group">
			<label for="date" class="custom-date-lookup__label">Date (MM/DD/YYYY)</label>
			<input
				bind:this={dateInput}
				type="text"
				id="date"
				class="custom-date-lookup__input"
				bind:value={userDate}
				required
				title="Please enter a date in the format MM/DD/YYYY"
				pattern={String.raw`^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$`}
				maxLength={10}
			/>
		</div>
		<!-- <button class="button">Submit</button> -->
	</form>
	{#if error}
		<p class="custom-date-lookup__error">{errorMessage}</p>
	{/if}
{/if}

<style>
	.custom-date-lookup {
		margin: 1.5rem auto 0;
		display: flex;
		justify-content: center;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		margin-right: 1rem;
		/* width: 12.5rem; */
	}

	.button {
		background: none;
		border: 1px solid #d0d0d0;
		font-family: 'Vulf Mono';
		font-size: 0.875rem;
		color: #d0d0d0;
		text-transform: uppercase;
		cursor: pointer;
		align-self: flex-end;
		padding: 0.75rem 1.5rem;
	}

	.custom-date-lookup__label {
		font-family: 'Vulf Sans';
		font-weight: 100;
		font-size: 0.75rem;
		color: #e4edff;
	}

	.custom-date-lookup__input {
		border-width: 0 0 2px 0;
		margin-top: 0.25rem;
		font-size: 1.25rem;
		font-family: 'Vulf Mono';
		font-weight: 500;
		color: #e4edff;
		background: none;
		padding: 0.125rem 0.5rem 0.125rem 0;
	}

	.custom-date-lookup__input:focus {
		background-color: none;
		outline: none;
		border-width: 0 0 2px 0;
		border-color: #86c2f6;
	}
</style>
