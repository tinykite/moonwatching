<script lang="ts">
	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';
	import { backgroundColor } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.style.backgroundColor = $backgroundColor;
	});
</script>

<div class="page-container">
	<slot />
</div>

<style>
	.page-container {
		width: 80%;
		margin: 0 auto;
	}
</style>
