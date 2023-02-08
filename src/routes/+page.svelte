<script lang="ts">
	import type { PageData } from './$types';
	import MoonPhase from '../components/MoonPhase.svelte';

	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import classNames from 'classnames';

	type Form = {
		email?: string;
		error?: string;
		success?: string;
	};

	let form: Form;
	$: form = $page?.form;

	let error: string | undefined;
	$: error = $page?.form?.error;

	let status: string | undefined;
	$: status = form?.error || form?.success;

	export let data: PageData;
</script>

<main class="page-container" aria-live="polite">
	<MoonPhase phase={data.moonPhase} />
	<h2 class="alert-header">Receive Updates on the New and Full Moon</h2>

	{#if form?.success}
		<p class="successMessage">{form?.success}</p>
	{:else}
		<form
			class="form"
			method="POST"
			use:enhance={() => {
				return async ({ update, result }) => {
					status = 'loading';
					update({ reset: false });

					if (result.type === 'error') {
						await applyAction(result);
					}
				};
			}}
		>
			<div class="inputContainer">
				<label class="label" for="email">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					value={form?.email ?? ''}
					class={classNames('input', { 'input--invalid': form?.error })}
				/>
				{#if form?.error}
					<p class="errorMessage">{$page?.form?.error}</p>
				{/if}
			</div>
			<button class="button">Sign up</button>
		</form>
	{/if}
</main>

<style>
	.page-container {
		display: grid;
		margin: 4rem auto;
	}

	.alert-header {
		font-size: 1.25rem;
		margin: 3rem 0 0;
	}

	form {
		display: grid;
		width: 100%;
		margin: 2rem auto 0;
	}

	.inputContainer {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 30rem;
	}

	.input {
		border-radius: 0.25rem;
		margin-top: 0.125rem;
		padding: 0.75rem;
		font-size: 0.875rem;
	}

	.input--invalid {
		border: 1px solid #d51b0c;
		outline: none;
	}

	.label {
		font-size: 1rem;
	}

	.errorMessage {
		color: #d51b0c;
		margin: 0.25rem 0 0 0;
	}

	.successMessage {
		margin: 3rem auto;
		text-align: center;
	}

	.button {
		margin-top: 1.5rem;
		font-size: 1rem;
		padding: 0.75rem 0;
		cursor: pointer;
		border-radius: 0.25rem;
		border: none;
		border: 1px solid #777;
		color: white;
		width: 100%;
		position: relative;
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
