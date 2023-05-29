<script lang="ts">
	import * as astronomy from '$lib/astronomy-reference';
	import { SvelteComponent, onMount } from 'svelte';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { animate } from 'motion';
	import { getContext } from 'svelte';

	let daysBeforeFullMoon: string;
	let intro: HTMLElement;
	let dialog = getContext('dialog') as SvelteStore<SvelteComponent>;

	const toggleDialog = () => {
		if (!dialog) return;
		$dialog.openEmailDialog();
	};

	onMount(() => {
		let mq: astronomy.MoonQuarter;
		const date = new Date();

		// Find next immediate moon quarter
		mq = astronomy.SearchMoonQuarter(date);

		// Search for the next full moon quarter
		while (mq.quarter !== 2) {
			mq = astronomy.NextMoonQuarter(mq);
		}

		daysBeforeFullMoon = formatDistanceToNowStrict(mq.time.date);
	});

	$: if (intro) animate(intro, { opacity: 1 }, { duration: 3 });
</script>

<main>
	<article>
		<h2 class="introduction" bind:this={intro}>
			Moon Watching was created to promote appreciation for the ebb and flow of the beautiful blob
			above us.
		</h2>
		<p class="text">
			Have you ever wondered when the moon will be brightest? Or gotten so wrapped in the stress of
			your daily life that you forgot the moon exists?
		</p>

		<p class="text">
			That happens to us, too. So we built this website, and a little notification robot to remind
			you to go outside and look up at the world.
		</p>

		<p class="text">
			Our hope is that this makes it easier to develop an appreciation for your own backyard — in
			addition, of course, to the sky above. And it gives us opportunity to share our nerdiest, most
			wonderful knowledge. For example:
		</p>

		{#if daysBeforeFullMoon}
			<p class="callout">
				it is currently <span class="callout--emphasis">{daysBeforeFullMoon}</span> before the moon is
				brightest
			</p>
		{/if}

		<p class="text">
			We probably wouldn’t remember that at the right moment if we tried. But that’s what our
			friendly moon robot is made for. And they’d love to help you discover just a little more magic
			in your universe.
		</p>

		<p class="text text--emphasis">
			—Your friends at <a href="https://postlight.com/">Postlight</a>
		</p>
	</article>

	<button class="button" on:click={() => toggleDialog()}>
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden={true}
			class="button__icon"
		>
			<path
				d="M16 7.99997C16 12.3162 12.4189 15.8143 8.01062 15.8143C7.94952 15.8143 7.89313 15.8143 7.83673 15.8097V0.190266C7.88843 0.185669 7.94952 0.185669 8.01062 0.185669C12.4189 0.185669 16 3.68372 16 7.99997Z"
				fill="#e4edff"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M7.88457 0.651193C7.82443 0.651193 7.78348 0.651451 7.74933 0.654603L7.73775 0.655672L7.72613 0.655917C3.80871 0.738405 0.653061 3.98936 0.653061 8C0.653061 12.0106 3.80871 15.2616 7.72613 15.3441L7.73775 15.3443L7.74933 15.3454C7.78348 15.3485 7.82442 15.3488 7.88457 15.3488C11.8699 15.3488 15.1161 12.0657 15.1161 8C15.1161 3.93425 11.8699 0.651193 7.88457 0.651193ZM7.87863 7.24124e-07L7.88457 1.42278e-06C12.2414 1.42278e-06 15.7691 3.58553 15.7691 8C15.7691 12.4145 12.2414 16 7.88457 16H7.87861C7.82926 16 7.76488 16 7.70161 15.9949C3.42356 15.899 0 12.3508 0 8C0 3.64917 3.42357 0.100982 7.70162 0.00510343C7.7649 -1.92263e-05 7.82928 -7.93141e-06 7.87863 7.24124e-07Z"
				fill="#e4edff"
			/>
		</svg>

		Sign up for moon alerts</button
	>
</main>

<style>
	main {
		display: grid;
		justify-items: center;
		padding-bottom: 1rem;
		color: #e4edff;
	}

	@media (min-width: 46rem) {
		main {
			padding-bottom: 5rem;
		}
	}

	article {
		margin: 0 auto;
	}

	.introduction,
	.callout {
		text-align: center;
		font-family: 'swear-text', serif;
		font-weight: 500;
		font-style: normal;
	}

	.introduction {
		font-size: 1.5rem;
		margin: 2rem auto;
		max-width: 40rem;
		opacity: 0;
	}

	@media (min-width: 46rem) {
		.introduction {
			font-size: 2rem;
			margin: 6rem auto;
		}
	}

	.text {
		margin-left: auto;
		margin-right: auto;
		max-width: 30rem;
		line-height: 1.5;
		font-size: 1.125rem;
		font-family: Avenir, 'Avenir Next LT Pro', Montserrat, Corbel, 'URW Gothic', source-sans-pro,
			sans-serif;
	}

	.text + .text {
		margin-top: 1.5rem;
	}

	.text--emphasis {
		font-family: swear-text, serif;
		font-weight: 500;
		font-style: italic;
	}

	.callout {
		font-size: 1.25rem;
		margin: 1.5rem auto 1.5rem;
	}

	@media (min-width: 46rem) {
		.callout {
			max-width: 60%;
			font-size: 1.75rem;
			margin: 3rem auto 3rem;
		}
	}

	.callout--emphasis {
		font-family: swear-text, serif;
		font-weight: 600;
		font-style: italic;
	}

	.button {
		display: flex;
		align-items: center;
		border-radius: 100px;
		border: 1px solid #e4edff;
		color: #e4edff;
		padding: 0.75rem 1.5rem;
		background: none;
		margin: 1.5rem auto 1.5rem;
		font-family: 'swear-display', serif;
		font-weight: 700;
		line-height: 1.125;
		font-weight: 500;
		font-style: normal;
		cursor: pointer;
	}

	@media (min-width: 46rem) {
		.button {
			font-size: 1.125rem;
			margin: 3rem auto 3rem;
		}
	}

	.button__icon {
		margin-right: 0.5rem;
	}
</style>
