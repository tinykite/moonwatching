<script lang="ts">
  import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
  } from "date-fns";

  type InputMoonData = {
    properties: {
      data: {
        closestphase: {
          day: number;
          month: number;
          phase: string;
          time: string;
          year: number;
        };
        curphase: string;
        day: number;
        month: number;
        year: number;
        fracillum: string;
      };
    };
  };

  let phases: Record<string, any[]> = $state({});

  const getDays = (monthIndex: number, year: number) => {
    const baseDate = new Date(year, monthIndex);
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

  const fetchInBatches = async (
    days: Array<string>,
    batchSize: number = 10,
  ) => {
    const results = [];
    for (let i = 0; i < days.length; i += batchSize) {
      const batch = days.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((day) => fetchPhase(day)),
      );
      results.push(...batchResults);
    }
    return results;
  };

  const getMonthName = (monthNum: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNum - 1];
  };

  const addSubphaseInfo = (item: any, index: number, array: any[]) => {
    const currentPhase = item.moon_phase;

    // Find where this consecutive phase started (go backwards)
    let phaseStartIndex = index;
    while (
      phaseStartIndex > 0 &&
      array[phaseStartIndex - 1].moon_phase === currentPhase
    ) {
      phaseStartIndex--;
    }

    // Find where this consecutive phase ends (go forwards)
    let phaseEndIndex = index;
    while (
      phaseEndIndex < array.length - 1 &&
      array[phaseEndIndex + 1].moon_phase === currentPhase
    ) {
      phaseEndIndex++;
    }

    const totalDaysInPhase = phaseEndIndex - phaseStartIndex + 1;
    const currentDayInPhase = index - phaseStartIndex + 1;

    return {
      ...item,
      subphase: currentDayInPhase,
      subphase_max_length: totalDaysInPhase,
    };
  };

  const transformMoonData = (inputArray: InputMoonData[]) => {
    const transformed = inputArray.map((item) => {
      const props = item.properties.data;
      const date = new Date(props.year, props.month - 1, props.day);
      const dateString = date.toLocaleDateString("en-CA"); // Returns YYYY-MM-DD format

      const isClosestPhaseDay =
        props.closestphase.day === props.day &&
        props.closestphase.month === props.month &&
        props.closestphase.year === props.year;

      const moonPhase = isClosestPhaseDay
        ? props.closestphase.phase
        : props.curphase;

      return {
        date: dateString,
        month: getMonthName(props.month),
        year: props.year,
        moon_phase: moonPhase,
        moon_phase_float: parseFloat(props.fracillum) / 100,
        source: "Astronomical Applications API",
      };
    });

    return transformed.map(addSubphaseInfo);
  };

  const fetchAllMonths = async () => {
    const groupedPhases: Record<string, any[]> = {};
    const currentYear = new Date().getFullYear();

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthDays = getDays(monthIndex, currentYear);
      const navalMoonData = await fetchInBatches(monthDays);
      const transformedData = transformMoonData(navalMoonData);

      // Group by month name
      const monthName = getMonthName(monthIndex + 1);
      groupedPhases[monthName] = transformedData;
    }

    phases = groupedPhases;
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    await fetchAllMonths();
  };
</script>

<div class="formContainer">
  <form
    class="form"
    onsubmit={(event) => {
      onSubmit(event);
    }}
  >
    <button class="button">Fetch All 12 Months</button>
  </form>

  {#if Object.keys(phases).length > 0}
    {JSON.stringify(phases, null, 2)}
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
