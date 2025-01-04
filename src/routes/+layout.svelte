<script lang="ts">
	import { run } from 'svelte/legacy';

	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';
	import Nav from '../components/Nav.svelte';
	import { setContext } from 'svelte';
	import type { SvelteComponent } from 'svelte';
	import { dialogRef } from '$lib/stores';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let dialog: SvelteComponent = $state();

	setContext('dialog', dialogRef);

	run(() => {
		if (dialog) {
			$dialogRef = dialog;
		}
	});
</script>

<div class="page-container">
	<Nav bind:this={dialog} />
	{@render children?.()}
</div>

<style>
	.page-container {
		width: 80%;
		margin: 0 auto;
	}
</style>
