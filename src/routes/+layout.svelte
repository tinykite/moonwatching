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
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
