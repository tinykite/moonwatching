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
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
		margin: 0 auto;
	}
</style>
