<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  const dispatch = createEventDispatcher();

  export let img: string;
  export let desc: string;
  export let id: number;
  export let currentIdStore: Writable<number>;

  // random rotation from 5 to 8 and -5 to -8
  let randRotation = Math.random() * 3 + 5 * (id % 2 ? 1 : -1);

  let translation = "0px, 0px";
  let rotations = randRotation + "deg";
  let faded = false;
  let transition = false;

  onMount(() => {
    setTimeout(() => {
      transition = true;
    }, 350);
  });

  let currentId = 0;
  currentIdStore.subscribe((value) => {
    // Previous project
    if (currentId == id) {
      translation = "-100vw, 0px";
      faded = true;
      setTimeout(() => {
        transition = false;
        translation = "100vw, 0px";
        faded = false;
      }, 300);
      setTimeout(() => {
        transition = true;
      }, 350);
    } else {
      rotations = randRotation + "deg";
      translation = "0px, 0px";
    }
    currentId = value;

    // If project is active
    if (currentId == id) {
      rotations = "0deg";
    }
  });
</script>

<div class="absolute h-72 w-full flex items-center flex-col">
  <button on:click={() => dispatch("click")}>
    <img
      src={img}
      alt={desc}
      class="aspect-video h-72 object-cover object-center border-2 border-accent2 rounded-sm
      {transition ? 'motion-safe:transition-all motion-safe:duration-300' : ''} {faded
        ? 'opacity-0'
        : 'opacity-100'}"
      style="transform: rotate({rotations}) translate({translation}); "
    />
  </button>
</div>
