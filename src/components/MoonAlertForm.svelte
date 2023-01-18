<script lang="ts">
	// TODO: Learn how to type the form data Svelte returns
	export let form: any;
	let error = form?.error;
</script>

{#if form?.success}
	<p class="successMessage">{form.success}</p>
{/if}

{#if !form?.success}
	<form class="form" method="POST">
		<div class="inputContainer">
			<label for="email">Email address</label>
			<input
				name="email"
				type="email"
				value={form?.email ?? ''}
				class={error ? 'input--invalid' : ''}
			/>
			{#if error}
				<p class="errorMessage">{error}</p>
			{/if}
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
	}

	.input--invalid {
		border: 1px solid #d51b0c;
		outline: none;
	}

	.errorMessage {
		color: #d51b0c;
	}

	.successMessage {
		margin: 3rem auto;
		text-align: center;
	}

	button {
		margin-top: 1.5rem;
		font-size: 1rem;
		padding: 0.375rem 0;
		cursor: pointer;
		border-radius: 0.5rem;
		border: none;
		border: 1px solid #777;
		color: white;
		width: 100%;
	}

	button:hover {
		background: white;
		color: #121212;
		border: 1px solid white;
	}
</style>
