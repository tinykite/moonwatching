<script lang="ts">
  import { run } from 'svelte/legacy';

  import { animate } from "motion";
  import classNames from "classnames";
  import { phase } from "$lib/stores";

  let dateInput: HTMLInputElement | null = $state();
  let userDate: string = $state();
  let error: boolean = $state();
  let errorMessage: string = $state();

  const validDateFormat =
    /^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-9]|2[0-9]|3(0|1))\/\d{4}$/;

  const onSubmitCustomDate = async () => {
    error = false;
    errorMessage = "";

    const dateParams = userDate.split("/");
    const month = dateParams[0];
    const day = dateParams[1];
    const year = dateParams[2];
    const dateString = `${year}-${month}-${day}`;

    const phaseResponse = await fetch(
      `https://aa.usno.navy.mil/api/rstt/oneday?date=${dateString}&coords=44.9772995,-93.2654692&tz=-6`,
    );
    const nextPhase = await phaseResponse.json();
    const { properties } = nextPhase;
    const { curphase } = properties.data;

    await animate(".illustrationContainer", { opacity: 0 }, { duration: 0.75 })
      .finished;
    phase.set(curphase);
    animate(".illustrationContainer", { opacity: 1 }, { duration: 0.75 });
  };

  run(() => {
    if (userDate && validDateFormat.test(userDate)) {
      onSubmitCustomDate();
    }
  });

  const onSubmit = (e: Event) => {
    e.preventDefault();

    if (!!userDate && validDateFormat.test(userDate)) {
      onSubmitCustomDate();
    } else {
      error = true;
      errorMessage = "Please enter a date in the format MM/DD/YYYY";
    }
  };
</script>

<form
  class="dateInputContainer"
  onsubmit={(event) => {
    onSubmit(event);
  }}
>
  <div class="input-group">
    <label for="date">Date (MM/DD/YYYY)</label>
    <input
      bind:this={dateInput}
      type="text"
      id="date"
      class={classNames("form__input", {
        "form__input--invalid": error,
      })}
      bind:value={userDate}
      maxLength={10}
    />
  </div>
</form>
<div
  class={classNames("form__errorMessage", {
    "form__errorMessage--visible": error,
  })}
>
  {errorMessage}
</div>

<style>
  .dateInputContainer {
    display: flex;
    justify-content: center;
    grid-row: 1;
    grid-column: 1 / 1;
    transform: translateX(100%);
    opacity: 0;
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }
</style>
