<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const newData = JSON.stringify(data);
</script>

{@html data.email}
