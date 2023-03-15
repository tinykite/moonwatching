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
		justify-content: space-between;
		margin-top: 3rem;
		align-items: center;
		color: #e4edff;
	}

	.nav__list {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav__list a {
		font-family: 'Vulf Mono';
		font-weight: 500;
		color: inherit;
		text-decoration: none;
	}
</style>
