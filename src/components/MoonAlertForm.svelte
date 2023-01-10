<script lang="ts">
	// TODO: Learn how to type the form data Svelte returns
	export let form: any;
</script>

{#if form?.error}
	<p>{form.error}</p>
{/if}

{#if form?.success}
	<p>{form.success}</p>
{/if}

{#if !form?.success}
	<form class="form" method="POST" action="?">
		<div class="inputContainer">
			<label for="email">Email</label>
			<input name="email" type="email" value={form?.email ?? ''} />
		</div>
		<button>Sign up</button>
	</form>
{/if}

<style>
	form {
		display: grid;
		justify-items: center;
		min-width: 80%;
		margin: 2rem auto;
	}

	.inputContainer {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 30rem;
	}

	input {
		border-radius: 0.5rem;
		margin-top: 1rem;
		padding: 0.5rem;
		border: none;
	}

	button {
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 0.5rem;
		margin-top: 1.5rem;
		border: none;
		background: white;
		color: #121212;
		width: 100%;
		border: 2px solid #121212;
	}

	button:hover {
		background: #121212;
		color: white;
		border: 2px solid white;
	}
</style>
