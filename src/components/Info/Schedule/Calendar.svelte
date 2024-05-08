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

  let className = "";
  let styleName = "";
  let heightVal = "";
  export { className as class, styleName as style, heightVal as height };
  export let preJson = undefined;
  export let preHeaders = undefined;
  if (preHeaders) preHeaders = new Headers(preHeaders);

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
  const timeColor = "#dc2626";

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

  const timeR = parseInt(timeColor.slice(1, 3), 16);
  const timeG = parseInt(timeColor.slice(3, 5), 16);
  const timeB = parseInt(timeColor.slice(5, 7), 16);

  const timeBg = `rgb(${timeR * 0.25 + bgR * 0.75}, ${timeG * 0.25 + bgG * 0.75}, ${
    timeB * 0.25 + bgB * 0.75
  })`;

  const startHour = DATES[0].getUTCHours();
  const endHour = DATES[DATES.length - 1].getUTCHours();

  const dayHours = [24 - startHour, ...Array(DATES.length - 2).fill(24), endHour + 1];

  const dateHeight = 2;
  const hourHeight = 6;
  const cols = 3;
  const overlap = 0.25;

  const itemWidth = 1 / (cols * -overlap + cols + overlap);
  const totalHeight =
    DATES.length * dateHeight +
    (dayHours[0] +
      dayHours[dayHours.length - 1] +
      (DATES.length - 2) * 24 +
      DATES.length * 0.5) *
      hourHeight -
    hourHeight / 2;

  let loading = true;
  let scrollLoaded = false;

  let events: Event[] = [];
  let eventPlacement: { startPos: number; height: number }[][];
  let scheduleCols: Event[][];

  let milestones: Milestone[] = [];

  let scheduleHeight = 0;
  let scheduleWidth = 0;

  let currentTime = new Date(
    new Date().getTime() -
      (import.meta.env.SSR ? 4 * 60 : new Date().getTimezoneOffset()) * 60000,
  );

  let followTime = true;

  function updateCurrentTime() {
    currentTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);

    currentTime.setFullYear(2024, 4, 17); // TODO: DEBUGGING - REMOVE THIS IN PROD

    setTimeout(updateCurrentTime, 60000 - (Date.now() % 60000));

    updateFollowTime();

    scrollLoaded = true;
  }

  function updateFollowTime() {
    if (
      minsOutsideEvent(currentTime) <= 0 &&
      followTime &&
      document.getElementById("scheduleContainer")
    ) {
      document.getElementById("scheduleContainer").scrollTop = scrollPos();
    }
  }

  function scrollPos() {
    return remToPx(timeToPos(currentTime) - 6);
  }

  function onManualScroll() {
    followTime = false;
  }

  function remToPx(rem: number) {
    if (import.meta.env.SSR) return rem * 16;
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  async function fetchEvents() {
    let resp = await fetch("/api/schedule");
    if (!resp.ok) {
      console.error("Failed to fetch events");
      alert("Failed to fetch events. Reload the page or view the full schedule.");
      return;
    }
    let data = await resp.json();

    processEvents(data);

    return resp;
  }

  function processEvents(data, suppressLogs = false) {
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
      ) as Event[];
    milestones = data.milestones.map((milestone: Milestone) => ({
      ...milestone,
      date: normalizeToUTC(new Date(milestone.date)),
    })) as Milestone[];
    scheduleCols = arrangeCols(events);
    eventPlacement = scheduleCols.map((col) => col.map(getEventStyle));

    if (!suppressLogs) {
      console.table(
        events.map((event) => {
          return {
            name: event.name,
            description: event.description,
            location: event.location,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
          };
        }),
      );
      console.table(
        milestones.map((milestone) => {
          return {
            name: milestone.name,
            date: milestone.date.toISOString(),
          };
        }),
      );
    }
  }

  function queueFetch(headers: Headers) {
    if (headers.has("Expires")) {
      let next = new Date(headers.get("Expires"));
      next.setSeconds(next.getSeconds() + Math.random() * 29 + 1); // Randomness to reduce load spikes
      if (!import.meta.env.SSR) {
        console.log("Fetching events again at", next);
        setTimeout(liveUpdate, next.getTime() - Date.now());
      }
    }
  }

  async function liveUpdate() {
    console.log("Fetching events...");
    let resp = await fetchEvents();
    queueFetch(resp.headers);
  }

  if (preJson && preHeaders) {
    processEvents(preJson, import.meta.env.SSR);
    loading = false;

    queueFetch(preHeaders);
  }

  onMount(async () => {
    updateCurrentTime();
    document
      .getElementById("scheduleContainer")
      .addEventListener("wheel", onManualScroll);
    document
      .getElementById("scheduleContainer")
      .addEventListener("touchmove", onManualScroll);

    if (!loading) return;
    await liveUpdate();
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

    events.forEach((event) => {
      let col = eventCols.findIndex((col) => !col.some((e) => conflictingTime(e, event)));
      if (col != -1) {
        eventCols[col].push(event);
      }
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

  function minsOutsideEvent(date: Date) {
    if (date.getTime() < DATES[0].getTime()) {
      return (DATES[0].getTime() - date.getTime()) / 60000;
    } else if (date.getTime() > DATES[DATES.length - 1].getTime()) {
      return (date.getTime() - DATES[DATES.length - 1].getTime()) / 60000;
    } else {
      return -1;
    }
  }
</script>

<div
  class={className}
  style="height: {heightVal}; {styleName}"
  id="scheduleContainer"
  bind:clientHeight={scheduleHeight}
  bind:clientWidth={scheduleWidth}
>
  <div
    class="font-sans {loading ? 'animate-pulse' : ''} relative {loading
      ? 'blur-sm'
      : ''} w-schedule"
    style="height: {totalHeight}rem; background-color: {bgColor}; {scrollLoaded ||
    minsOutsideEvent(currentTime) >= 0
      ? ''
      : `transform: translateY(calc(-1*max(0px, min(${scrollPos()}px, calc(${totalHeight}rem - ${heightVal})))))`}"
  >
    <!-- Calendar background/template -->
    {#each DATES as date, i}
      <!-- Date display -->
      <div
        class="sticky left-0 right-0 top-0 z-40 px-4 bg-primary-bg font-semibold flex items-center"
        style="height: {dateHeight}rem"
      >
        <div class="w-full flex">
          <p class="sticky left-4 mr-auto">
            {date.toLocaleDateString("en-CA", {
              weekday: "long",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <p class="right-4 sticky">Day {i + 1}</p>
        </div>
      </div>

      <!-- Hour markings -->
      <div
        style="height: {dayHours[i] * hourHeight +
          hourHeight / 2 -
          (i == DATES.length - 1 ? hourHeight / 2 : 0)}rem"
        class="relative"
      >
        <div style="height: {hourHeight / 2}rem"></div>
        {#each Array(dayHours[i]) as _, j}
          <div
            class="border-t border-gray-400 mr-4 ml-16"
            style="height: {i == DATES.length - 1 && j == endHour
              ? hourHeight / 2
              : hourHeight}rem"
          ></div>
          <p
            class="absolute top-0 w-10 text-right text-xs text-gray-400 left-4"
            style="transform: translateY({hourHeight / 2 + hourHeight * j - 0.5}rem)"
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

    {#if !loading}
      <!-- Milestones -->
      {#each milestones as milestone}
        <div
          class="absolute z-10 top-0 left-0 right-0 ml-16 mr-4 border-t-2 text-sm uppercase flex"
          style="color: {itemColors.special}; border-color: {itemColors.special}; transform: translateY(calc({timeToPos(
            milestone.date,
          )}rem - 1px))"
        >
          <p class="text-right ml-auto sticky right-2 font-medium">
            {formatTime(milestone.date)} - {milestone.name}
          </p>
        </div>
      {/each}

      <!-- Calender Items-->
      <div
        class="absolute top-0 left-0 right-0 {minsOutsideEvent(currentTime) <= 0
          ? 'ml-20'
          : 'ml-16'} mr-4"
      >
        {#each scheduleCols as eventCol, i}
          {#each eventCol as event, j}
            <div
              style="height: calc({eventPlacement[i][j].height}rem - 1px); width: {100 *
                itemWidth}%;
                transform: translate(calc({i * 100}% - calc({overlap *
                100 *
                i}%)), {eventPlacement[i][j].startPos}rem);
                background-color: {itemBgs[event.type] || itemBgs.default};
                border-color: {itemColors[event.type] || itemColors.default};"
              class="{durationMinutes(event) > 30
                ? 'py-2'
                : !isSameDay(event.start, event.end) && minsToMidnight(event.start) <= 15
                  ? 'py-0.5'
                  : 'flex flex-col justify-center'}
              absolute rounded-md bg-green-600/50 border-l-[3px] border-green-600 px-3 text-sm"
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
                <!-- Not enough room (Restricted by date display) -->
                <p class="text-sm h-full">
                  <span class="font-semibold">{event.name}</span>,
                  {formatTime(event.start)} - {formatTime(event.end)}{event.location
                    ? ", " + event.location
                    : ""}
                </p>
              {:else}
                <!-- Not enough room (Event is too short) -->
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

      <!-- Current time indicator -->
      {#if minsOutsideEvent(currentTime) <= 0}
        <div class="absolute top-0 left-0 right-0 mx-4 z-10">
          <div
            id="currentTime"
            class="absolute left-[4.45rem] right-0 border-t-[3px]"
            style="transform: translateY({timeToPos(
              currentTime,
            )}rem); border-top-color: {timeColor}"
          ></div>
          <p
            class="sticky left-2 h-8 text-xs font-semibold flex items-center w-[4.5rem] justify-center rounded-full border-[3px]"
            style="transform: translateY(calc({timeToPos(
              currentTime,
            )}rem - 0.9rem)); background-color: {timeBg}; border-color: {timeColor}"
          >
            {formatTime(currentTime)}
          </p>
        </div>
        {#if !followTime}
          <div class="absolute top-0 z-50 left-0 right-0 flex bottom-0 justify-center">
            <div
              class="h-7 rounded-full sticky left-0 right-0 top-0 flex items-center justify-center"
              style="transform: translateY(calc({scheduleHeight}px - 2.5rem)); width: {scheduleWidth}px"
            >
              <button
                class="bg-red-600 px-4 h-full rounded-full text-xs uppercase pointer-events-auto"
                on:click|preventDefault={() => {
                  followTime = true;
                  updateFollowTime();
                }}
              >
                Go to current time
              </button>
            </div>
          </div>
        {/if}
      {/if}
    {/if}
  </div>
</div>

<style>
  .w-schedule {
    width: max(100%, 46rem);
  }
</style>
