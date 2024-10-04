<!-- <script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { SvelteComponent } from 'svelte';
	import { page } from '$app/stores';
	import classNames from 'classnames';
	import HalfMoon from '../../components/illustrations/HalfMoon.svelte';

	type Form = {
		email?: string;
		error?: string;
		success?: string;
	};

	let nav: HTMLElement;
	let emailDialog: SvelteComponent;

	// The $: beneath these variables is necessary to subscribe to a built-in store
	// And trigger a re-render when the store updates.

	let form: Form;
	$: form = $page?.form;

	let error: string | undefined;
	$: error = $page?.form?.error;

	let status: string | undefined;
	$: status = $page?.form?.status;
</script>

<div class="formContainer">
	<HalfMoon variant="light" size={48} />
	<h1 class="formContainer__heading">Signup for email updates on the new and full Moon</h1>
	<form
		class="form u-marginTop-sm"
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
		<label class="form__label" for="email">Email address</label>
		<div class="form__input-group">
			<input
				id="email"
				name="email"
				type="email"
				value={form?.email ?? ''}
				class={classNames('form__input form__input--sm', {
					'form__input--invalid': error
				})}
			/>

			<p class={classNames('form__errorMessage', { 'form__errorMessage--visible': error })}>
				{error ? error : ''}
			</p>
		</div>

		<div class="u-marginTop-xs u-marginAuto u-flex u-justifyContent-center">
			<button class="form__button form__button--tertiary">
				{#if status === 'loading'}
					<span class="u-visuallyHidden">Loading</span>
					<div class="form__dot" />
					<div class="form__dot" />
					<div class="form__dot" />
				{:else}
					Submit
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.formContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 400px;
		margin: 3rem auto;
	}

	.formContainer__heading {
		font-family: 'swear-text', serif;
		font-weight: 500;
		font-style: normal;
		font-size: 1.5rem;
		color: #d1d1d1;
		text-align: center;
		line-height: 1.125;
		margin-top: 1.5rem;
	}

	.form {
		width: 80%;
	}
</style> -->
