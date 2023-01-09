<script lang="js">
	export let form;
</script>

{#if form?.error}
	<p>{form.error}</p>
{/if}

{#if form?.success}
	<p>{form.success}</p>
{/if}

{#if !form?.success}
	<form method="POST" action="?">
		<label>
			Email
			<input name="email" type="email" value={form?.email ?? ''} />
		</label>
		<button>Sign up</button>
	</form>
{/if}
