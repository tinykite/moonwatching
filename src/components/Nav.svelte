<script>
	import Logo from './Logo.svelte';
</script>

<nav class="nav">
	<Logo />
	<ul class="nav__list">
		<li>
			<a href="#alertForm">Get Moon Alerts</a>
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

	.nav__list a {
		color: inherit;
		text-decoration: none;
	}

	@media (min-width: 37rem) {
		.nav__list {
			display: block;
		}
	}
</style>
