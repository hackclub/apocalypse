<script lang="ts">
  let y: number = 0;
  let screenW: number = 0;
</script>

<svelte:window bind:scrollY={y} bind:innerWidth={screenW} />

<header class="min-h-screen flex justify-center text-purple-50 relative overflow-hidden">
  <!-- Content  -->
  <div class="max-w-4xl items-center flex justify-center sm:grid sm:grid-rows-9 mx-4">
    <div
      class="flex flex-col items-center sm:gap-y-6 sm:row-span-6 sm:row-start-1"
      style="transform: translate(0, {screenW > 640 ? y / 2 : 0}px);"
    >
      <img src="/apotitle.png" alt="Apocalypse" class=" max-w-64 sm:max-w-sm" />
      <div class="text-center space-y-2">
        <h1 class="text-3xl xs:text-4xl sm:text-5xl">
          The <span class="text-accent2">high school hackathon</span> where you build fun
          tech to survive the
          <span class="text-accent">zombie apocalypse</span>!
        </h1>
        <h2 class="text-xl xs:text-2xl sm:text-3xl">May 17-19 @ Shopify Toronto</h2>
        <a
          href="#"
          target="_blank"
          class="bg-accent2 px-12 sm:px-16 text-xl xs:text-2xl sm:text-3xl rounded-xl inline-block"
          >Register now!</a
        >
      </div>
    </div>
  </div>

  <!-- Background Effects -->
  <div class="absolute min-h-screen w-screen sm:bg-radial -z-40 mt-12 sm:mt-32"></div>
  <div
    style="height: {(y * 3) / 16}px"
    class="bg-dark-bg z-20 absolute w-screen bottom-0"
  ></div>
  <div
    class="absolute w-screen min-h-screen bottom-0 bg-repeat-x bg-bottom bg-contain sm:-mb-32"
    style="background-image: url(/hero/parallax-1.svg);
    transform: translate(0,{screenW > 640 ? (-y * 3) / 16 : 0}px)"
  ></div>
  <div
    class="absolute w-screen min-h-screen -z-20 bottom-0 bg-repeat-x bg-bottom bg-contain sm:-mb-32"
    style="background-image: url(/hero/parallax-2.svg);
    transform: translate(0,{screenW > 640 ? (-y * 2) / 16 : 0}px)"
  ></div>
  <div
    class=" absolute w-screen min-h-screen -z-30 bottom-0 bg-no-repeat bg-bottom sm:-mb-24 bg-contain"
    style="background-image: url(/hero/parallax-3.svg);
    transform: translate(0,{screenW > 640 ? (-y * 1) / 16 : 0}px)"
  ></div>
  <div
    class="absolute w-screen min-h-screen -z-40 bottom-0 bg-repeat-x bg-bottom sm:-mb-32 bg-contain"
    style="background-image: url(/hero/parallax-4.svg);
    transform: translate(0,{screenW > 640 ? (-y * 0) / 16 : 0}px)"
  ></div>
  <div
    class="hidden sm:block opacity-30 absolute w-screen min-h-screen -z-10 bottom-0 bg-repeat-x bg-top bg-contain"
    style="background-image: url(/hero/parallax-top-1.svg);"
  ></div>
  <div
    class="hidden sm:block opacity-30 absolute w-screen min-h-screen -z-20 bottom-0 bg-repeat-x bg-top bg-contain"
    style="background-image: url(/hero/parallax-top-2.svg);
    transform: translate(0,{-y / 8}px)"
  ></div>
  <div
    class="hidden sm:block opacity-30 absolute w-screen min-h-screen -z-30 bottom-0 bg-no-repeat bg-top bg-contain mb-48"
    style="background-image: url(/hero/parallax-top-3.svg);
    transform: translate(0,{(-y * 2) / 8}px)"
  ></div>
  <div
    class="hidden sm:block opacity-30 absolute w-screen min-h-screen -z-40 bottom-0 bg-repeat-x bg-top bg-contain mb-40"
    style="background-image: url(/hero/parallax-top-4.svg);
    transform: translate(0,{(-y * 3) / 8}px)"
  ></div>
</header>

<style>
  @media (min-width: 0) {
    .sm\:bg-radial {
      background-image: radial-gradient(#5f32ca 0%, #2b1b50 70%);
    }
  }
</style>
