<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Logo from "./Logo.svelte";
  import Menu from "./Menu.svelte";

  let mediaQuery: MediaQueryList = $state();
  let isMinDesktop: boolean | undefined = $state();

  const setMatches = () => {
    isMinDesktop = mediaQuery.matches;
  };

  onMount(() => {
    mediaQuery = window.matchMedia("(min-width: 800px)");
    setMatches();
    mediaQuery.addEventListener("change", () => setMatches());
  });

  onDestroy(() => {
    mediaQuery && mediaQuery.removeEventListener("change", () => setMatches());
  });
</script>

<nav class="nav">
  <Logo />
  {#if isMinDesktop}
    <ul class="nav__list">
      <li class="nav__item">
        <a href="/about" class="nav__link">About</a>
      </li>

      <li class="nav__item">
        <a href="/phases-by-month" class="nav__link">Phases by Month</a>
      </li>
    </ul>
  {:else if mediaQuery}
    <Menu />
  {/if}
</nav>

<style>
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
    color: #e4edff;
    font-family: "Vulf Mono", "Nimbus Mono PS", "Courier New", "Cutive Mono",
      monospace;
    font-weight: 500;
    font-size: 1rem;
  }

  .nav:hover .nav__item:not(:hover) {
    opacity: 0.65;
  }

  .nav__list {
    display: flex;
    list-style: none;
    margin: 1.5rem auto 0;
    padding: 0;
  }

  .nav__link {
    text-decoration: none;
  }

  .nav__item:not(:last-child) {
    margin-right: 0.75rem;
  }

  @media (min-width: 23.5rem) {
    .nav__item:not(:last-child) {
      margin-right: 1rem;
    }
  }

  @media (min-width: 37rem) {
    .nav__item:not(:last-child) {
      margin-right: 1.75rem;
    }

    .nav__list {
      margin: 0;
    }
  }
</style>
