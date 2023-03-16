<script lang="ts">
	import type { PageData } from './$types';
	import MoonPhase from '../components/MoonPhase.svelte';
	import Nav from '../components/Nav.svelte';

	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import classNames from 'classnames';
	import { interpolate } from '$lib/math-utils';
	import Color from 'colorjs.io';
	import { backgroundColor } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { format } from 'date-fns';

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

	const formattedDate = format(new Date(data.moonPhase.date), 'MMMM do, yyyy');

	let eclipticDomain = data.moonPhase.ecliptic_longitude > 180 ? [181, 360] : [0, 180];
	const backgroundOffset = interpolate({
		domain: eclipticDomain,
		range: [0, 1],
		value: data.moonPhase.ecliptic_longitude
	});
	const color = new Color('#001D4A');
	color.lch.l *= backgroundOffset;
	backgroundColor.set(color.toString({ format: 'hex' }));

	const unsubscribe = backgroundColor.subscribe((value) => {
		if (browser) {
			document.body.style.backgroundColor = value;
		}
	});

	onDestroy(unsubscribe);
</script>

<Nav />
<!-- According to best practices, a page should only have one global aria-live region.  -->
<main aria-live="polite" class="moonContainer">
	<MoonPhase phase={data.moonPhase.phase} />
	<p class="date">
		{formattedDate}
	</p>
	<h2 class="alert-header">Get Email Alerts on the New and Full Moon</h2>

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
</main>

<style>
	.moonContainer {
		display: grid;
		margin: 15vh auto 2rem;
		align-items: center;
		justify-content: center;
	}

	.date {
		margin-top: 6.5rem;
		text-align: center;
		font-family: 'Vulf Mono';
		font-size: 1.25rem;
		font-weight: 700;
		color: #e4edff;
	}

	.alert-header {
		font-size: 1rem;
		margin: 3rem 0 0;
		text-align: center;
		color: #e4edff;
	}

	.main {
		max-width: 80%;
	}

	form {
		display: grid;
		align-items: start;
		grid-column-gap: 1rem;
		grid-row-gap: 0.5rem;
		grid-template-columns: 1fr 5rem;
		width: 100%;
		margin-top: 1rem;
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
		grid-row: 1;
		color: #e4edff;
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

	button {
		background-color: none;
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
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
