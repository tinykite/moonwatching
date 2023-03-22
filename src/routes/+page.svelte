<script lang="ts">
	import type { PageData } from './$types';
	import MoonPhase from '../components/MoonPhase.svelte';
	import Nav from '../components/Nav.svelte';

	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import classNames from 'classnames';
	import { getBackgroundColorScales, interpolate } from '$lib/math-utils';
	import Color from 'colorjs.io';
	import { backgroundColor } from '$lib/stores';
	import { browser } from '$app/environment';
	import DateInput from '../components/DateInput.svelte';
	import CurrentDate from '../components/CurrentDate.svelte';
	import { phase } from '$lib/stores';

	type Form = {
		email?: string;
		error?: string;
		success?: string;
	};

	// The $: beneath these variables is necessary to subscribe to a built-in store
	// And trigger a re-render when the store updates.

	let form: Form;
	$: form = $page?.form;

	let error: string | undefined;
	$: error = $page?.form?.error;

	let status: string | undefined;
	$: status = $page?.form?.status;

	export let data: PageData;

	phase.set(data.moonPhase.phase);

	const { eclipticDomain, lightnessRange } = getBackgroundColorScales(
		data.moonPhase.ecliptic_longitude
	);

	const backgroundOffset = interpolate({
		domain: eclipticDomain,
		range: lightnessRange,
		value: data.moonPhase.ecliptic_longitude
	});
	const color = new Color('#001D4A');
	color.lch.l *= backgroundOffset;
	backgroundColor.set(color.toString({ format: 'hex' }));

	// TODO: For performance, rewrite this to animate the opacity of a background color, rather than animating between two colors.
	$: if (browser) {
		document.body.style.backgroundColor = $backgroundColor;
	}
</script>

<Nav />
<!-- According to best practices, a page should only have one global aria-live region.  -->
<main aria-live="polite" class="moonContainer">
	{#if phase}
		<MoonPhase phase={$phase} />

		<div class="dateContainer">
			<CurrentDate currentDate={data.moonPhase.date} />
			<DateInput />
		</div>
	{/if}

	<div class="form">
		<h2 class="alert-header">New and Full Moon Email Alerts</h2>

		{#if form?.success}
			<p class="successMessage">{form?.success}</p>
		{:else}
			<form
				class="form"
				id="alertForm"
				method="POST"
				use:enhance={() => {
					status = 'loading';
					return async ({ update, result }) => {
						await update();

						if (result.type === 'error') {
							await applyAction(result);
						}
					};
				}}
			>
				<label class="label" for="email">Email address</label>
				<div class="input-group">
					<input
						id="email"
						name="email"
						type="email"
						value={form?.email ?? ''}
						class={classNames('input', { 'input--invalid': error })}
					/>

					<p class={classNames('errorMessage', { 'errorMessage--visible': error })}>
						{error ?? error}
					</p>
				</div>

				<button class="button">
					{#if status === 'loading'}
						<span class="sr-only">Loading</span>
						<div class="dot" />
						<div class="dot" />
						<div class="dot" />
					{:else}
						Submit
					{/if}
				</button>
			</form>
		{/if}
	</div>
</main>

<style>
	.moonContainer {
		display: grid;
		margin: 8vh auto 0;
		align-items: center;
	}

	@media (min-width: 1440px) {
		.moonContainer {
			margin: 15vh auto 2rem;
		}
	}

	.dateContainer {
		margin-top: 3rem;
	}

	@media (min-width: 1441px) {
		.dateContainer {
			margin-top: 6.5rem;
		}
	}

	.alert-header {
		font-size: 1rem;
		font-family: 'Vulf Mono';
		font-weight: 500;
		font-style: normal;
		margin-top: 3rem;
		text-align: center;
		color: #e4edff;
	}

	.form {
		max-width: 40ch;
		margin: 0 auto;
	}

	form {
		display: grid;
		align-items: start;
		grid-column-gap: 1rem;
		grid-row-gap: 0.5rem;
		grid-template-columns: 1fr 5rem;
		width: 100%;
	}

	.input {
		border: 1px solid #888888;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		height: 2.5rem;
		padding: 0 0.5rem;
		background-color: #0f1f38;
		color: #e4edff;
	}

	.input:focus {
		outline: #86c2f6 solid 1px;
		border: 1px solid #86c2f6;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		grid-row: 2;
	}

	.dot {
		height: 0.5rem;
		width: 0.5rem;
		background-color: #fff;
		border-radius: 50%;

		animation: dotFade 2s linear infinite;
	}

	.dot:not(:last-child) {
		margin-right: 0.5rem;
	}

	.dot:nth-of-type(2) {
		animation-delay: 0.25s;
	}

	.dot:nth-of-type(3) {
		animation-delay: 0.5s;
	}

	@keyframes dotFade {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.input--invalid {
		border: 1px solid #d51b0c;
		outline: none;
	}

	.label {
		font-size: 0.75rem;
		font-family: 'Vulf Sans';
		grid-row: 1;
		color: #e4edff;
		margin-top: 1rem;
	}

	.errorMessage {
		color: #d51b0c;
		margin: 0.5rem 0 0 0;
		opacity: 0;
		transition: opacity 0.5s ease-in;
	}

	.errorMessage--visible {
		opacity: 1;
	}

	.successMessage {
		margin: 3rem auto;
		text-align: center;
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		cursor: pointer;
		border-radius: 0.25rem;
		border: none;
		border: 1px solid #888888;
		background: #0f1f38;
		color: #e4edff;
		width: 100%;
		position: relative;
		grid-row: 2;
		height: 2.5rem;
	}

	.button:hover {
		background: white;
		color: #121212;
		border: 1px solid white;
	}

	@media (min-width: 50rem) {
		.alert-header {
			margin: 6rem auto 0;
		}
	}
</style>
