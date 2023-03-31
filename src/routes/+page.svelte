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
	import { animate } from 'motion';
	import Dialog from '../components/Dialog.svelte';
	import type { SvelteComponent } from 'svelte';
	import { prevent_default } from 'svelte/internal';

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

	$: if (browser && phase) {
		document.body.style.backgroundColor = $backgroundColor;
		animate('.illustrationWrapper', { opacity: 1 }, { duration: 1 });
	}

	function closeEmailDialog() {
		emailDialog.close();
	}
</script>

<Nav {emailDialog} />
<main class="moonContainer">
	<MoonPhase phase={$phase} />

	<div class="dateContainer">
		<CurrentDate currentDate={data.moonPhase.date} />
		<DateInput />
	</div>

	<Dialog
		success={$page?.form?.success}
		bind:this={emailDialog}
		title="Sign up for email updates on the new and full moon"
	>
		<span slot="icon" class="u-marginAuto">
			<svg
				width="48"
				height="50"
				viewBox="0 0 48 50"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M46 25C46 38.2565 35.4715 49 22.5112 49C22.3316 49 22.1658 49 22 48.9859V1.01412C22.152 1 22.3316 1 22.5112 1C35.4715 1 46 11.7435 46 25Z"
					fill="#000E24"
				/>
				<path
					d="M46.1872 25C46.1872 38.0226 36.0625 48.5704 23.5936 48.5704C23.4242 48.5704 23.2547 48.5704 23.0994 48.5556C10.8423 48.2905 1 37.8459 1 25C1 12.1542 10.8423 1.70959 23.0994 1.44442C23.2547 1.42969 23.4242 1.42969 23.5936 1.42969C36.0625 1.42969 46.1872 11.9774 46.1872 25Z"
					stroke="#000E24"
					stroke-width="2"
				/>
			</svg>
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
</style>
