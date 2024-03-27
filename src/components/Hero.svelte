<script lang="ts">
  let y: number = 0;
  let screenW: number = 0;
</script>

<svelte:window bind:scrollY={y} bind:innerWidth={screenW} />

<header class="relative flex justify-center min-h-screen overflow-hidden text-purple-50">
  <!-- Content  -->
  <div class="flex items-center justify-center max-w-4xl mx-4 sm:grid sm:grid-rows-9">
    <div
      class="flex flex-col items-center gap-y-8 sm:gap-y-6 sm:row-span-6 sm:row-start-1"
      style="transform: translate(0, {screenW > 640 ? y / 2 : 0}px);"
    >
      <img
        src="/apotitle.png"
        alt="Apocalypse"
        class="max-w-64 sm:max-w-sm 3xl:max-w-lg"
      />
      <div class="space-y-4 text-center sm:space-y-2">
        <h1 class="text-3xl xs:text-4xl sm:text-5xl 3xl:text-6xl">
          The <span class="text-accent2">high school hackathon</span> where you build fun
          tech to survive the
          <span class="text-accent">zombie apocalypse</span>!
        </h1>
        <h2 class="text-xl xs:text-2xl sm:text-3xl 3xl:text-4xl">
          May 17-19 @ Shopify Toronto
        </h2>
        <a
          href="#"
          target="_blank"
          class="inline-block px-12 text-xl bg-accent2 sm:px-16 3xl:px-24 xs:text-2xl sm:text-3xl 3xl:text-4xl rounded-xl"
          >Register now!</a
        >
      </div>
    </div>
  </div>

  <!-- Background Effects -->
  <div
    class="absolute sm:min-h-screen sm:w-screen w-[150vw] bg-radial -z-40 mt-12 sm:mt-32 bottom-0 sm:bottom-auto h-96"
    style="transform: translate(0,{screenW > 640 ? (y * 2) / 4 : 120}px)"
  ></div>

  <div
    class="absolute bottom-0 w-screen min-h-screen bg-bottom bg-repeat-x bg-contain sm:-mb-32 pointer-events-none"
    style="background-image: url(/hero/parallax-1.svg);"
  ></div>
  <div
    class="absolute bottom-0 w-screen min-h-screen bg-bottom bg-repeat-x bg-contain -z-20 sm:-mb-24"
    style="background-image: url(/hero/parallax-2.svg);
    transform: translate(0,{screenW > 640 ? (y * 1) / 4 : 0}px)"
  ></div>
  <div
    class="absolute bottom-0 w-screen min-h-screen bg-bottom bg-repeat-x bg-contain -z-30 sm:-mb-24"
    style="background-image: url(/hero/parallax-3.svg);
    transform: translate(0,{screenW > 640 ? (y * 2) / 4 : 0}px)"
  ></div>
  <img
    src="/hero/parallax-3-cn.svg"
    alt="CN Tower"
    class="absolute bottom-0 left-0 -z-30 sm:-mb-24 ml-[5vw] max-w-[4vw]"
    style="transform: translate(0,{screenW > 640 ? (y * 2) / 4 : 0}px)"
  />
  <div
    class="absolute bottom-0 w-screen min-h-screen bg-bottom bg-repeat-x bg-contain -z-40 sm:-mb-44"
    style="background-image: url(/hero/parallax-4.svg);
      transform: translate(0,{screenW > 640 ? (y * 3) / 4 : 0}px)"
  ></div>
  <div class="absolute w-screen opacity-30 sm:-top-20 -z-10">
    <div
      class="absolute w-screen min-h-screen bg-top bg-repeat-x bg-contain sm:mt-16 -z-10"
      style="background-image: url(/hero/parallax-top-1.svg);
      transform: translate(0,{(y * 3) / 8}px)"
    ></div>
    <div
      class="absolute w-screen min-h-screen bg-top bg-repeat-x bg-contain -z-20"
      style="background-image: url(/hero/parallax-top-2.svg);
      transform: translate(0,{(y * 2) / 8}px)"
    ></div>
    <div
      class="absolute w-screen min-h-screen bg-top bg-no-repeat bg-contain -z-30"
      style="background-image: url(/hero/parallax-top-3.svg);
      transform: translate(0,{y / 8}px)"
    ></div>
    <div
      class="absolute w-screen min-h-screen bg-top bg-repeat-x bg-contain -z-40"
      style="background-image: url(/hero/parallax-top-4.svg);
      "
    ></div>
  </div>
</header>

<style>
  .bg-radial {
    background-image: radial-gradient(#6b5ffe 0%, #2b1b50 70%);
  }
</style>
