<script lang="ts">
	import { timeline, stagger } from 'motion';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	let isOpen: boolean = false;
	let mobileNavRef: HTMLElement;

	const handleClick = async () => {
		if (!isOpen) {
			isOpen = true;
			timeline([
				['.mobileNav', { opacity: 1 }],
				['.mobileNav__button--close', { opacity: 1 }, { duration: 0.3 }],
				['.mobileNav__item', { opacity: 1 }, { delay: stagger(0.1), at: '-0.3' }]
			]);
		} else {
			await timeline([
				['.mobileNav__button--close', { opacity: 0 }, { duration: 0.3 }],
				['.mobileNav__item', { opacity: 0 }, { delay: stagger(0.1), duration: 0.3, at: '-0.3 }' }],
				['.mobileNav', { opacity: 0 }]
			]).finished;
			isOpen = false;
		}
	};

	onMount(() => {
		mobileNavRef.addEventListener('click', () => handleClick());
	});

	onDestroy(() => {
		mobileNavRef.removeEventListener('click', () => handleClick());
	});
</script>

<button aria-hasPopup="true" on:click={() => handleClick()} class="navButton">
	<span class="u-visuallyHidden">Open Navigation Menu</span>
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path d="M3 18H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M3 12H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		<path d="M3 6H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
</button>

<div
	class="mobileNav"
	bind:this={mobileNavRef}
	inert={isOpen ? undefined : true}
	aria-hidden={isOpen ? undefined : true}
>
	<button
		class="mobileNav__button mobileNav__button--close"
		on:click={() => {
			handleClick();
		}}
	>
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17 1L1 17"
				stroke="#e4edff"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1 1L17 17"
				stroke="#e4edff"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	<ul class="mobileNav__list">
		<li class="mobileNav__item">
			<a href="/about" class="mobileNav__link">About</a>
		</li>

		<li class="mobileNav__item">
			<a href="/phases-by-month" class="mobileNav__link">Phases by Month</a>
		</li>
		<li class="mobileNav__item">
			<a href="/newsletter-signup" class="mobileNav__link">Alerts</a>
		</li>
	</ul>
</div>

<style>
	.mobileNav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: #001d4a;
		z-index: 5;
		display: flex;
		justify-content: center;
		padding-top: 3rem;
		opacity: 0;
	}

	.mobileNav__list {
		list-style: none;
		text-align: center;
		padding: 0;
		margin-top: 5rem;
	}

	.mobileNav__item {
		font-size: 1.5rem;
		opacity: 0;
	}

	.mobileNav__item:not(:first-child) {
		margin-top: 3rem;
	}

	.mobileNav__link {
		text-decoration: none;
		color: #e4edff;
	}

	.navButton,
	.mobileNav__button {
		border: none;
		background: none;
		stroke: white;
		cursor: pointer;
	}

	.mobileNav__button {
		color: #e4edff;
	}

	.mobileNav__button--close {
		position: absolute;
		top: 4.25rem;
		right: 3.5rem;
	}
</style>
