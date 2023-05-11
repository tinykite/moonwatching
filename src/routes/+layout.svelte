<script lang="ts">
	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';
	import Nav from '../components/Nav.svelte';
	import { setContext } from 'svelte';
	import type { SvelteComponent } from 'svelte';
	import { dialogRef } from '$lib/stores';

	let dialog: SvelteComponent;

	setContext('dialog', dialogRef);

	$: if (dialog) {
		$dialogRef = dialog;
	}
</script>

<div class="page-container">
	<Nav bind:this={dialog} />
	<slot />
</div>

<style>
	.page-container {
		width: 80%;
		margin: 0 auto;
	}
</style>
