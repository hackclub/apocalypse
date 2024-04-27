<script lang="ts">
  ("!! READ THIS ⬇ BEFORE EDITING THIS FILE !!");
  /*
  !!!!!!!!!!! Information on Dates & Timezones !!!!!!!!!!!
  To prevent issues with device timezones, all dates are to be inputted
  as UTC, but read as EDT (-4:00 - the local time of venue). For example:
  2024 May 17, 11 pm EDT would be written as 2024-05-17T23:00:00Z,
  2024 May 1, 1 am EDT would be written as 2024-05-01T01:00:00Z.
  Basically, ignore the Z at the end of the date string and treat it as EDT.
  When logging to console, convert .toISOString to remove the timezone need.
  */

  import { onMount } from "svelte";

  type Event = {
    name: string;
    type?: string;
    location?: string;
    description?: string;
    start: Date;
    end: Date;
    fullDay: boolean;
  };

  type Milestone = {
    name: string;
    date: Date;
  };

  const DATES = [
    new Date("2024-05-17T16:00:00Z"),
    new Date("2024-05-18T00:00:00Z"),
    new Date("2024-05-19T14:00:00Z"),
  ];

  const bgColor = "#1A1030"; // dark-bg with black at 50% opacity
  const itemColors = {
    logistics: "#0b8043",
    food: "#039be5",
    workshop: "#8e24aa",
    activity: "#3f51b5",
    ceremony: "#f6bf26",
    special: "#f4511e",
    default: "#616161",
  };
  const itemBgs = { ...itemColors };

  const bgR = parseInt(bgColor.slice(1, 3), 16);
  const bgG = parseInt(bgColor.slice(3, 5), 16);
  const bgB = parseInt(bgColor.slice(5, 7), 16);

  Object.entries(itemColors).forEach(([key, value]) => {
    let r = parseInt(value.slice(1, 3), 16);
    let g = parseInt(value.slice(3, 5), 16);
    let b = parseInt(value.slice(5, 7), 16);

    itemBgs[key] = `rgb(${r * 0.75 + bgR * 0.25}, ${g * 0.75 + bgG * 0.25}, ${
      b * 0.75 + bgB * 0.25
    })`;
  });

  const startHour = DATES[0].getUTCHours();
  const endHour = DATES[DATES.length - 1].getUTCHours();

  const dayHours = [24 - startHour, ...Array(DATES.length - 2).fill(24), endHour + 1];
  let scheduleWidth: number;

  const dateHeight = 2;
  const hourHeight = 6;
  const cols = 4;
  const overlap = 0.25;

  const itemWidth = (1 + (cols - 1) * overlap) / cols;
  console.log(itemWidth);
  const totalHeight =
    DATES.length * dateHeight +
    (dayHours[0] +
      dayHours[dayHours.length - 1] +
      (DATES.length - 2) * 24 +
      DATES.length * 0.5) *
      hourHeight;

  let loading = true;

  let events: Event[] = [];
  let eventPlacement: { startPos: number; height: number }[][];
  let scheduleCols: Event[][];

  let milestones: Milestone[] = [];

  async function fetchEvents() {
    const resp = await fetch("/api/schedule/events");
    if (!resp.ok) {
      console.error("Failed to fetch events");
      return;
    }
    const data = await resp.json();
    events = data.events
      .map((event: Event) => ({
        ...event,
        start: normalizeToUTC(new Date(event.start)),
        end: normalizeToUTC(new Date(event.end)),
      }))
      .filter(
        (event: Event) =>
          !event.fullDay &&
          event.start >= DATES[0] &&
          event.end <= DATES[DATES.length - 1],
      );
    milestones = data.milestones.map((milestone: Milestone) => ({
      ...milestone,
      date: normalizeToUTC(new Date(milestone.date)),
    }));
    scheduleCols = arrangeCols(events);
    eventPlacement = scheduleCols.map((col) => col.map(getEventStyle));

    console.table([
      "Valid Events",
      ...events.map((event) => {
        return {
          name: event.name,
          description: event.description,
          location: event.location,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        };
      }),
    ]);
    console.table([
      "Event Columns",
      ...scheduleCols.map((col) =>
        col.map((event) => `${event.start.getUTCDate()} - ${event.name}`),
      ),
    ]);
  }

  onMount(async () => {
    await fetchEvents();
    loading = false;
  });

  // READ COMMENTS ABOVE BEFORE EDITING
  function normalizeToUTC(date: Date) {
    let UTC = new Date(date.toISOString());
    UTC.setUTCHours(UTC.getUTCHours() - 4); // Calendar is in EDT
    return UTC;
  }

  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getUTCFullYear() == date2.getUTCFullYear() &&
      date1.getUTCMonth() == date2.getUTCMonth() &&
      date1.getUTCDate() == date2.getUTCDate()
    );
  }

  function minutesToRem(minutes: number) {
    return (hourHeight / 60) * minutes;
  }

  function timeToMinutes(time: Date) {
    return time.getUTCHours() * 60 + time.getUTCMinutes();
  }

  function arrangeCols(events: Event[]) {
    let eventCols: Event[][] = new Array(cols).fill(0).map(() => []);

    function conflictingTime(event1: Event, event2: Event) {
      if (event1.start.getTime() == event2.start.getTime()) {
        return true;
      }
      return (
        (event1.start.getTime() > event2.start.getTime() &&
          event1.start.getTime() < event2.end.getTime()) ||
        (event1.end.getTime() > event2.start.getTime() &&
          event1.end.getTime() < event2.end.getTime()) ||
        (event1.start.getTime() < event2.start.getTime() &&
          event1.end.getTime() > event2.end.getTime()) ||
        event1.start.getTime() == event2.start.getTime() ||
        event1.end.getTime() == event2.end.getTime()
      );
    }

    events.sort((a, b) => {
      if (a.start.getTime() == b.start.getTime()) {
        return (
          b.end.getTime() - b.start.getTime() - (a.end.getTime() - a.start.getTime())
        );
      }
      return a.start.getTime() - b.start.getTime();
    });
    console.log(events);

    events.forEach((event) => {
      let col = eventCols.findIndex((col) => !col.some((e) => conflictingTime(e, event)));
      if (col != -1) {
        eventCols[col].push(event);
      }
      console.log(event.name, event.start.getUTCDate(), col);
    });

    return eventCols;
  }

  function durationMinutes(event: Event) {
    return (event.end.getTime() - event.start.getTime()) / 60000;
  }

  function minsToMidnight(date: Date) {
    return (
      (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0) -
        date.getTime()) /
      60000
    );
  }

  function timeToPos(date: Date) {
    const day = DATES.findIndex((d) => isSameDay(d, date));
    return (
      (day + 1) * dateHeight +
      minutesToRem(
        dayHours.slice(0, day).reduce((a, v) => a + v, 0) * 60 +
          day * 30 +
          timeToMinutes(date) -
          (day == 0 ? startHour * 60 : 0),
      ) +
      hourHeight / 2
    );
  }

  function getEventStyle(event: Event) {
    const startPos = timeToPos(event.start);
    const endPos = timeToPos(event.end);
    const height = endPos - startPos; // - (event.end.getUTCHours() == 0 ? hourHeight / 2 + dateHeight : 0);
    return {
      startPos,
      height,
    };
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    });
  }
</script>

<div
  class="font-sans {loading ? 'animate-pulse' : ''} relative {loading
    ? 'blur-sm'
    : ''} w-schedule"
  style="height: {totalHeight}rem; background-color: {bgColor}"
>
  <!-- Calendar background/template -->
  {#each DATES as date, i}
    <div
      class="sticky top-0 z-50 bg-primary-bg font-semibold px-4 flex items-center"
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
    <div style="height: {dayHours[i] * hourHeight + hourHeight / 2}rem" class="relative">
      <div style="height: {hourHeight / 2}rem"></div>
      {#each Array(dayHours[i]) as _, j}
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
    </div>
  {/each}
  {#each milestones as milestone}
    <div
      class="absolute z-10 top-0 left-0 right-0 ml-16 mr-4 border-t-2 text-sm uppercase"
      style="color: {itemColors.special}; border-color: {itemColors.special}; transform: translateY(calc({timeToPos(
        milestone.date,
      )}rem - 1px))"
    >
      <p class="text-right">{formatTime(milestone.date)} - {milestone.name}</p>
      <p></p>
    </div>
  {/each}
  {#if !loading}
    <div
      class="absolute top-0 left-0 right-0 ml-16 mr-4"
      bind:clientWidth={scheduleWidth}
    >
      {#each scheduleCols as eventCol, i}
        {#each eventCol as event, j}
          <div
            style="height: {eventPlacement[i][j]
              .height}rem; width: calc(calc(100% - 5rem) * {itemWidth});
              transform: translate(calc(calc({scheduleWidth}px - 5rem) * {(itemWidth -
              overlap) *
              i}), {eventPlacement[i][j].startPos}rem);
              background-color: {itemBgs[event.type] || itemBgs.default};
              border-color: {itemColors[event.type] || itemColors.default};
              border-bottom-color: {bgColor};"
            class="{durationMinutes(event) > 30
              ? 'py-2'
              : !isSameDay(event.start, event.end) && minsToMidnight(event.start) <= 15
                ? 'py-0.5'
                : 'flex flex-col justify-center'}
            absolute rounded-md bg-green-600/50 border-l-[3px] border-green-600 px-3 text-sm hover:z-40 border-b"
          >
            {#if (durationMinutes(event) > 15 && isSameDay(event.start, event.end)) || (!isSameDay(event.start, event.end) && minsToMidnight(event.start) >= 15)}
              <p class="items-center font-semibold">
                {event.name}
              </p>
              <p>
                {formatTime(event.start)} - {formatTime(event.end)}{event.location
                  ? ", " + event.location
                  : ""}
              </p>
            {:else if minsToMidnight(event.start) <= 15}
              <p class="text-sm h-full">
                <span class="font-semibold">{event.name}</span>,
                {formatTime(event.start)} - {formatTime(event.end)}{event.location
                  ? ", " + event.location
                  : ""}
              </p>
            {:else}
              <p class="text-sm h-full flex items-center">
                <span class="font-semibold">{event.name}</span>,
                {formatTime(event.start)} - {formatTime(event.end)}{event.location
                  ? ", " + event.location
                  : ""}
              </p>
            {/if}
          </div>
        {/each}
      {/each}
    </div>
  {/if}
</div>

<style>
  .w-schedule {
    width: max(100%, 50rem);
  }
</style>