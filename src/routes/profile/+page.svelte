<!-- <script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '../../lib/supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import Account from '../../components/Account.svelte'
  import Auth from '../../components/Auth.svelte'

  let session: AuthSession

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      session = data.session
    })

    supabase.auth.onAuthStateChange((_event, _session) => {
      session = _session
    })
  })
</script>

<div class="container" style="padding: 50px 0 100px 0">
  {#if !session}
  <Auth />
  {:else}
  <Account {session} />
  {/if}
</div> -->