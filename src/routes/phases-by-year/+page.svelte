<script lang="ts">
  import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
  } from "date-fns";

  import { phases2025 } from "../../data/moonData2025revised";

  console.log(phases2025);

  const options = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  let chosenMonth = $state(0);
  let phases: unknown = $state();

  const getDays = (monthIndex: number) => {
    const baseDate = new Date(new Date().getFullYear(), monthIndex);
    const start = startOfMonth(baseDate);
    const end = endOfMonth(start);
    return eachDayOfInterval({ start, end }).map((date) =>
      format(date, "yyyy-MM-dd"),
    );
  };

  const fetchPhase = async (dateString: string) => {
    const res = await fetch(
      `https://aa.usno.navy.mil/api/rstt/oneday?date=${dateString}&coords=44.9772995,-93.2654692&tz=-6`,
    );
    if (!res.ok) throw new Error(`Failed to fetch item ${dateString}`);
    return res.json();
  };

  const fetchAllPhases = async (days: Array<string>) => {
    try {
      const results = await Promise.all(days.map((date) => fetchPhase(date)));
      return results;
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const allCurrentDays = getDays(chosenMonth);
    phases = await fetchAllPhases(allCurrentDays);
  };
</script>

<div class="formContainer">
  <form
    class="form"
    onsubmit={(event) => {
      onSubmit(event);
    }}
  >
    <label for="month">Choose a Month</label>
    <select id="month" bind:value={chosenMonth}>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>

    <button class="button">Submit</button>
  </form>

  {#if Array.isArray(phases)}
    {JSON.stringify(phases)}
  {/if}
</div>

<style>
  .formContainer {
    max-width: 50ch;
    margin-inline: auto;
    margin-block: 5rem;
  }
  .form {
    display: grid;
    gap: 0.5rem;
  }

  .button {
    width: max-content;
    background: white;
    color: black;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    margin-block-start: 1rem;
  }
</style>
