<script lang="ts">

  import { animate } from "motion";
  let intro: HTMLElement;

  $: if (intro) animate(intro, { opacity: 1 }, { duration: 3 });
</script>

<main>
  <article>
    <p class="introduction" bind:this={intro}>
      Moon Watching was created to promote appreciation for the ebb and flow of
      the beautiful blob above us.
    </p>
    <p class="text">
      Have you ever wondered when the moon will be brightest? Or gotten so
      wrapped in the stress of your daily life that you forgot the moon exists?
    </p>

    <p class="text">
      That happens to me, too. So I built this website to make it easier to
      explore the different phases of the moon, plus a little notification robot
      to remind us all to go outside and look up at the world.
    </p>

    <p class="text">
      The moon notification bot is currently on a hiatus. But Moon Watching as a
      project will continue to evolve to explore ways in which creative
      technology can make it easier to develop an appreciation for your own
      backyard — in addition, of course, to the sky above.
	</p>

    <h2 class="heading">Data & Methodology</h2>
    <p class="text">
      The Moon Watching website uses data based on information provided by the <a
        href="https://aa.usno.navy.mil/index"
        >Astronomical Applications Department</a
      > of the U.S. Naval Observatory.
    </p>

    <h2 class="heading">Credits</h2>
    <p class="text">
      Moon Watching began as a <a href="https://postlight.com/labs"
        >Postlight Labs</a
      >
      project, designed and developed by
      <a href="https://www.tinykitelab.com/"> Dakota Sexton</a>. Built with
      Netlify, Svelte, and Supabase (Postgres). And featuring the incredibly
      typography of the
      <a href="https://ohnotype.co/">OH No Type Company</a>
      and
      <a href="https://www.futurefonts.xyz/">Future Fonts</a>.
    </p>

    <p class="text">
      If you spot anything inconsistent, or want to chat about this project,
      please don't hesitate to reach out by <a
        href="mailto:dakotaATtinykitelabDOTcom">email.</a
      >
    </p>
  </article>
</main>

<style>
  main {
    display: grid;
    justify-items: center;
    padding-bottom: 1rem;
    color: #e4edff;
  }

  @media (min-width: 46rem) {
    main {
      padding-bottom: 5rem;
    }
  }

  article {
    margin: 0 auto;
  }
  .heading,
  .callout,
  .introduction {
    font-family: "swear-text", serif;
    font-weight: 500;
    font-style: normal;
  }

  .introduction {
    opacity: 0;
    margin: 2rem auto;
    font-size: 1.5rem;
    text-align: center;
    max-width: 40rem;
  }

  .heading {
    margin: 1rem auto 1rem;
    max-width: 30rem;
  }

  @media (min-width: 46rem) {
    .heading {
      font-size: 1.5rem;
      margin: 2rem auto 1rem;
    }

    .introduction {
      font-size: 2rem;
      margin: 6rem auto;
    }
  }

  .text {
    margin-left: auto;
    margin-right: auto;
    max-width: 30rem;
    line-height: 1.5;
    font-size: 1.125rem;
    font-family: Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic",
      source-sans-pro, sans-serif;
  }

  .text + .text {
    margin-top: 1.5rem;
  }

  .callout {
    font-size: 1.25rem;
    margin: 1.5rem auto 1.5rem;
    text-align: center;
  }

  @media (min-width: 46rem) {
    .callout {
      max-width: 60%;
      font-size: 1.75rem;
      margin: 3rem auto 3rem;
    }
  }

  .callout--emphasis {
    font-family: swear-text, serif;
    font-weight: 600;
    font-style: italic;
  }

  .button {
    display: flex;
    align-items: center;
    border-radius: 100px;
    border: 1px solid #e4edff;
    color: #e4edff;
    padding: 0.75rem 1.5rem;
    background: none;
    margin: 1.5rem auto 0;
    font-family: "swear-display", serif;
    line-height: 1.125;
    font-weight: 500;
    font-style: normal;
    cursor: pointer;
  }

  @media (min-width: 46rem) {
    .button {
      font-size: 1.125rem;
      margin: 3rem auto 3rem;
    }
  }

  .button__icon {
    margin-right: 0.5rem;
  }
</style>
