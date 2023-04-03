<script lang="ts">
	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';
	import Nav from '../components/Nav.svelte';
</script>

<div class="page-container">
	<Nav />
	<slot />
</div>

<style>
	.page-container {
		width: 80%;
		margin: 0 auto;
	}
</style>
