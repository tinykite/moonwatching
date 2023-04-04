<script lang="ts">
	import * as astronomy from '$lib/astronomy-reference';
	import { onMount } from 'svelte';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { animate } from 'motion';

	let daysBeforeFullMoon: string;
	let intro: HTMLElement;

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
			friendly moon robot, Simon, is made for. And they’d love to help you discover just a little
			more magic in your universe.
		</p>

		<p class="text text--emphasis">
			—Your friends at <a href="https://postlight.com/">Postlight</a>
		</p>
	</article>
</main>

<style>
	main {
		display: grid;
		justify-items: center;
		padding-bottom: 5rem;
		color: #e4edff;
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
		font-size: 2rem;
		margin-top: 6rem;
		margin-bottom: 6rem;
		max-width: 40rem;
		opacity: 0;
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
		font-size: 1.75rem;
		margin: 3rem auto 3rem;
		max-width: 60%;
	}

	.callout--emphasis {
		font-family: swear-text, serif;
		font-weight: 600;
		font-style: italic;
	}

	/* .button {
		outline: none;
		border: 1px solid #e4edff;
		background: none;
		border-radius: 100px;
		padding: 0.5rem 1rem 0.55rem;
		margin: 3rem auto 0;
		cursor: pointer;
	} */
</style>
