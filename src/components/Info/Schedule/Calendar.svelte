<script lang="ts">
  import { onMount } from "svelte";

  // Put in UTC to prevent timezone differences on different devices
  // Pretend these are local time
  const DATES = [
    new Date("2024-05-17T16:00:00Z"),
    new Date("2024-05-18T00:00:00Z"),
    new Date("2024-05-19T14:00:00Z"),
  ];

  const startHour = DATES[0].getUTCHours();
  const endHour = DATES[DATES.length - 1].getUTCHours();

  const dayHours = [24 - startHour, ...Array(DATES.length - 2).fill(24), endHour + 1];

  const dateHeight = 2;
  const hourHeight = 6;

  const totalHeight =
    DATES.length * dateHeight +
    (dayHours[0] + dayHours[dayHours.length - 1] + (DATES.length - 2) * 24) * hourHeight;

  console.log(startHour, endHour);

  let loading = true;

  onMount(async () => {
    const events = await fetch("/api/schedule/events");
    if (events.ok) {
      loading = false;
    }
  });

  function minuteToRem(minute: number) {
    return (hourHeight / 60) * minute;
  }

  console.log(dayHours.slice(0, 3));
</script>

<div
  class="bg-black/40 font-sans {loading ? 'animate-pulse' : ''}  relative"
  style="height: {totalHeight}rem"
>
  <!-- Calendar background/template -->
  {#each DATES as date, i}
    <div
      class="sticky top-0 z-50 w-full bg-primary-bg font-semibold px-4 flex items-center"
      style="height: {dateHeight}rem"
    >
      <p class="grow">
        {date.toLocaleDateString("en-CA", {
          weekday: "long",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })}
      </p>
      <p>Day {i + 1}</p>
    </div>
    <div style="height: {dayHours[i] * hourHeight}rem" class="relative">
      <div style="height: {hourHeight / 2}rem"></div>
      {#each Array(dayHours[i] - 1) as _, j}
        <div
          class="border-t border-gray-400 mr-4 ml-16"
          style="height: {hourHeight}rem"
        ></div>
        <p
          class="absolute top-0 w-10 text-right text-xs text-gray-400"
          style="transform: translate(1rem, {hourHeight / 2 + hourHeight * j - 0.5}rem)"
        >
          {j + (i == 0 ? startHour : 0) == 0
            ? "12"
            : j + (i == 0 ? startHour : 0) > 12
              ? j + (i == 0 ? startHour : 0) - 12
              : j + (i == 0 ? startHour : 0)}
          {j + (i == 0 ? startHour : 0) >= 12 ? "PM" : "AM"}
        </p>
      {/each}
      <div
        class="border-t border-gray-400 mr-4 ml-16"
        style="height: {hourHeight / 2}rem"
      ></div>
      <p
        class="absolute top-0 w-10 text-right text-xs text-gray-400"
        style="transform: translate(1rem, {hourHeight / 2 +
          hourHeight * (dayHours[i] - 1) -
          0.5}rem)"
      >
        {dayHours[i] - 1 + (i == 0 ? startHour : 0) == 0
          ? "12"
          : dayHours[i] - 1 + (i == 0 ? startHour : 0) > 12
            ? dayHours[i] - 1 + (i == 0 ? startHour : 0) - 12
            : dayHours[i] - 1 + (i == 0 ? startHour : 0)}
        {dayHours[i] - 1 + (i == 0 ? startHour : 0) >= 12 ? "PM" : "AM"}
      </p>
    </div>
  {/each}
</div>
