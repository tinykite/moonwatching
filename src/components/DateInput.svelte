<script lang="ts">
	import { indeterminateDate } from '$lib/stores';
	import { fade } from 'svelte/transition';

	let dateForm: HTMLElement | null;
	let dateInput: HTMLInputElement | null;
	let userDate: string;

	// if (browser) {
	// 	dateForm = document.querySelector('.custom-date-lookup');
	// }

	// const unsubscribe = indeterminateDate.subscribe((value) => {
	// 	if (!dateForm) return;

	// 	dateForm.hidden = $indeterminateDate;
	// 	dateForm.style.opacity = $indeterminateDate ? '1' : '0';
	// });

	// onDestroy(unsubscribe);
</script>

{#if $indeterminateDate}
	<form class="custom-date-lookup" transition:fade>
		<label for="date" class="custom-date-lookup__label">Date (MM/DD/YYYY)</label>
		<input
			bind:this={dateInput}
			type="text"
			id="date"
			class="custom-date-lookup__input"
			bind:value={userDate}
		/>
	</form>
{/if}

<!-- <form class="custom-date-lookup" hidden>
	<label for="date" class="custom-date-lookup__label">Date (MM/DD/YYYY)</label>
	<input
		bind:this={dateInput}
		type="text"
		id="date"
		class="custom-date-lookup__input"
		bind:value={userDate}
	/>
</form> -->
<style>
	.custom-date-lookup {
		width: 16rem;
		margin: 1.5rem auto 0;
		display: flex;
		flex-direction: column;
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
