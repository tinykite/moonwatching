<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Logo from './Logo.svelte';
	import Dialog from './Dialog.svelte';
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import classNames from 'classnames';
	import HalfMoon from './illustrations/HalfMoon.svelte';

	type Form = {
		email?: string;
		error?: string;
		success?: string;
	};

	let emailDialog: SvelteComponent;

	// The $: beneath these variables is necessary to subscribe to a built-in store
	// And trigger a re-render when the store updates.

	let form: Form;

	$: form = $page?.form;

	let error: string | undefined;
	$: error = $page?.form?.error;

	let status: string | undefined;
	$: status = $page?.form?.status;

	function openEmailDialog() {
		emailDialog.open();
	}

	function closeEmailDialog() {
		emailDialog.close();
	}
</script>

<nav class="nav">
	<Logo />
	<ul class="nav__list">
		<li>
			<button on:click={() => openEmailDialog()}>Get Moon Alerts</button>
		</li>
	</ul>
</nav>

<Dialog
	success={$page?.form?.success}
	bind:this={emailDialog}
	title="Sign up for email updates on the new and full moon"
>
	<span slot="icon" class="u-marginAuto">
		<HalfMoon />
	</span>

	<div slot="form" class="u-marginTop-sm">
		<form
			class="form"
			id="alertForm"
			method="POST"
			action="/"
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
			<!-- Fixes an issue where hitting enter on an input dismisses the modal without waiting for client or server-side validation -->
			<!-- This should be hidden from keyboard users and screenreaders alike -->
			<button disabled style="display:none;" />
			<label class="form__label form__label--light" for="email">Email address</label>
			<div class="form__input-group">
				<input
					id="email"
					name="email"
					type="email"
					value={form?.email ?? ''}
					class={classNames('form__input form__input--light form__input--sm', {
						'form__input--invalid': error
					})}
				/>

				<p class={classNames('form__errorMessage', { 'form__errorMessage--visible': error })}>
					{error ? error : ''}
				</p>
			</div>

			<div class="u-marginTop-xs u-marginAuto u-flex u-justifyContent-center">
				<button class="form__button form__button--inverse" on:click={() => closeEmailDialog()}
					>Close</button
				>
				<button class="form__button">
					{#if status === 'loading'}
						<span class="sr-only">Loading</span>
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
</Dialog>

<style>
	.nav {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
		align-items: center;
		color: #e4edff;
		font-family: 'Vulf Mono', 'Nimbus Mono PS', 'Courier New', 'Cutive Mono', monospace;
		font-weight: 500;
	}

	@media (min-width: 37rem) {
		.nav {
			justify-content: space-between;
		}
	}

	.nav__list {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		display: none;
	}

	.nav__list button {
		color: inherit;
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
	}

	@media (min-width: 37rem) {
		.nav__list {
			display: block;
		}
	}
</style>
