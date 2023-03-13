<script>
	// Importing this in the layout, instead of app.html, to enable HMR
	import '../styles/global.css';
</script>

<div class="page-container">
	<slot />
</div>

<style>
	.page-container {
		background: black;
		width: 80%;
		margin: 0 auto;
	}
</style>
