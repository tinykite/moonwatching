<script lang="ts">
	let isOpen: boolean = false;
	const handleClick = () => {
		isOpen = !isOpen;
	};
</script>

<button aria-hasPopup="true" on:click={() => handleClick()} class="navButton">
	<span class="u-sr-only">Open Navigation Menu</span>
	<svg
		class="menuIcon"
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

<style>
	.mobileNav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: #d7e4ff;
	}

	.navButton {
		border: none;
		background: none;
		stroke: white;
	}
</style>
