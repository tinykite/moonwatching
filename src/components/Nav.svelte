<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Logo from './Logo.svelte';
	export let emailDialog: SvelteComponent;

	function openEmailDialog() {
		emailDialog.open();
	}
</script>

<nav class="nav">
	<Logo />
	<ul class="nav__list">
		<li>
			<button on:click={() => openEmailDialog()}>Get Moon Alerts</button>
		</li>
	</ul>
</nav>

<style>
	.nav {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
		align-items: center;
		color: #e4edff;
		font-family: 'Vulf Mono';
		font-weight: 500;
	}

	@media (min-width: 37rem) {
		.nav {
			justify-content: space-between;
		}
	}

	.nav__list {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		display: none;
	}

	.nav__list button {
		color: inherit;
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
	}

	@media (min-width: 37rem) {
		.nav__list {
			display: block;
		}
	}
</style>
