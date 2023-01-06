<script lang="ts">
	import type { PageData } from './$types';
	import { env } from '$env/dynamic/public';

	export let data: PageData;
	import MoonPhase from '../MoonPhase.svelte';
	console.log(env.PUBLIC_SUPABASE_URL);
</script>

<MoonPhase phase={data.moonPhase} />
