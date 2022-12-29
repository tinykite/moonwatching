<div class="page-container">
	<slot />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.page-container {
		background: black;
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
