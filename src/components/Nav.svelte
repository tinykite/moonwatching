<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { onDestroy, onMount } from 'svelte';
	import Logo from './Logo.svelte';
	// import Dialog from './Dialog.svelte';
	// import { enhance, applyAction } from '$app/forms';
	// import { page } from '$app/stores';
	// import classNames from 'classnames';
	// import HalfMoon from './illustrations/HalfMoon.svelte';
	import Menu from './Menu.svelte';

	type Form = {
		email?: string;
		error?: string;
		success?: string;
	};

	// let emailDialog: SvelteComponent;

	// The $: beneath these variables is necessary to subscribe to a built-in store
	// And trigger a re-render when the store updates.
	// let form: Form;
	// $: form = $page?.form;

	// let error: string | undefined;
	// $: error = $page?.form?.error;

	// let status: string | undefined;
	// $: status = $page?.form?.status;

	// export function openEmailDialog() {
	// 	emailDialog.open();
	// }

	// export function closeEmailDialog() {
	// 	emailDialog.close();
	// }

	let mediaQuery: MediaQueryList;
	let isMinDesktop: boolean | undefined;

	const setMatches = () => {
		isMinDesktop = mediaQuery.matches;
	};

	onMount(() => {
		mediaQuery = window.matchMedia('(min-width: 800px)');
		setMatches();
		mediaQuery.addEventListener('change', () => setMatches());
	});

	onDestroy(() => {
		mediaQuery && mediaQuery.removeEventListener('change', () => setMatches());
	});
</script>

<nav class="nav">
	<Logo />
	{#if isMinDesktop}
		<ul class="nav__list">
			<li class="nav__item">
				<a href="/about" class="nav__link">About</a>
			</li>

			<li class="nav__item">
				<a href="/phases-by-month" class="nav__link">Phases by Month</a>
			</li>
			<!-- Moon Phase Alerts are on hiatus -->
			<!-- <li class="nav__item">
				<button on:click={() => openEmailDialog()} class="nav__button">Alerts</button>
			</li> -->
		</ul>
	{:else if mediaQuery}
		<Menu />
	{/if}
</nav>

	<!--<Dialog
	success={$page?.form?.success}
	bind:this={emailDialog}
	title="Sign up for email updates on the new and full moon"
>
	<span slot="icon" class="u-marginAuto">
		<HalfMoon variant="dark" size={48} />
	</span>

	<div slot="form" class="u-marginTop-sm">
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
				<button class="form__button form__button--secondary" on:click={() => closeEmailDialog()}
					>Close</button
				>
				<button class="form__button">
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
</Dialog> -->

<style>
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 3rem;
		color: #e4edff;
		font-family: 'Vulf Mono', 'Nimbus Mono PS', 'Courier New', 'Cutive Mono', monospace;
		font-weight: 500;
		font-size: 1rem;
	}

	.nav:hover .nav__item:not(:hover) {
		opacity: 0.65;
	}

	.nav__list {
		display: flex;
		list-style: none;
		margin: 1.5rem auto 0;
		padding: 0;
	}

	.nav__button {
		color: inherit;
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
	}

	.nav__link {
		text-decoration: none;
	}

	.nav__item:not(:last-child) {
		margin-right: 0.75rem;
	}

	@media (min-width: 23.5rem) {
		.nav__item:not(:last-child) {
			margin-right: 1rem;
		}
	}

	@media (min-width: 37rem) {
		.nav__item:not(:last-child) {
			margin-right: 1.75rem;
		}

		.nav__list {
			margin: 0;
		}
	}
</style>
