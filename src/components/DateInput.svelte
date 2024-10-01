<script lang="ts">
	import * as astronomy from '$lib/astronomy-reference';
	import { phase } from '$lib/stores';
	import { calculatePhase } from '$lib/moon-utils';
	import { animate } from 'motion';
	import classNames from 'classnames';

	let dateInput: HTMLInputElement | null;
	let userDate: string;
	let error: boolean;
	let errorMessage: string;

	const validDateFormat = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$/;

	const onSubmitCustomDate = async () => {
		error = false;
		errorMessage = '';

		const dateParams = userDate.split('/');
		const month = parseInt(dateParams[0]) - 1;
		const day = parseInt(dateParams[1]);
		const year = parseInt(dateParams[2]);

		// TODO: Find a more efficient way to set this
		// Date object will not accept a string literal as valid date arguments
		// Passing a full date string is not recommended
		const date = new Date();
		date.setFullYear(year);
		date.setMonth(month);
		date.setDate(day);

		const nextQuarter = astronomy.SearchMoonQuarter(date);
		const newPhase = calculatePhase({ nextQuarter, date });

		await animate('.illustrationContainer', { opacity: 0 }, { duration: 0.75 }).finished;
		phase.set(newPhase);
		animate('.illustrationContainer', { opacity: 1 }, { duration: 0.75 });
	};

	$: if (userDate && validDateFormat.test(userDate)) {
		onSubmitCustomDate();
	} 

	const onSubmit = (e: Event) => {
		e.preventDefault();

		if (!!userDate && validDateFormat.test(userDate)) {
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
			class={classNames('form__input', {
				'form__input--invalid': error
			})}
			bind:value={userDate}
			maxLength={10}
		/>
	</div>
</form>
<div 	class={classNames('form__errorMessage', {
	'form__errorMessage--visible': error
})}>{errorMessage}</div>


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
