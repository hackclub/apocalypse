<script lang="ts">
  import { writable } from "svelte/store";
  import ProjectItem from "./ProjectItem.svelte";

  let projects = [
    {
      img: "https://cloud-a79ukykof-hack-club-bot.vercel.app/0outernet-127.jpg",
      desc: "a flamethrower guitar made from a toy guitar and a sunscreen bottle, that blows flames when played!",
      credit: "Outernet",
      creditLink: "https://outernet.hackclub.com",
      id: 0,
    },
    {
      img: "https://cloud-fo135ts22-hack-club-bot.vercel.app/0hack_club_assemble_ltnj_01238.jpg",
      desc: "a maze puzzle to help you navigate the world with JavaScript, using Hack Club Sprig.",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 1,
    },
    {
      img: "https://lh3.googleusercontent.com/pw/ABLVV87dSBsIeoHT_QvW9Xrb4YHRGPwfBDvyk5mPgzx2J7TUPi3Kh7sloCkR04zKpfhP2XIkb1Nk-fuSFz4GUok9Pb4iws6xY_xMfdDUaWMuH-K3ENZ8OW8F75_xzPS8yM0Gx9oZ8U9GvY-kVUfChjbzO3apOQ=w1658-h933-s-no-gm?authuser=0",
      desc: "tetris a game to help you navigate the world with JavaScript, using Hack Club Sprig.",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 2,
    },
  ];

  let currentId = 1;
  const currentIdStore = writable(0);
  currentIdStore.set(1);

  let transitioning = false;
  currentIdStore.subscribe((value) => {
    transitioning = true;
    setTimeout(() => {
      transitioning = false;
      currentId = value;
      console.log(currentId);
    }, 350);
  });

  function shiftToProject(amount: number) {
    let shifted = [...projects];

    for (let i = 0; i < projects.length - 1 - amount; i++) {
      let project = shifted.pop();
      if (project) {
        shifted.unshift(project);
      }
    }

    return shifted;
  }

  function clickHandler() {
    currentIdStore.set(
      (((currentId - 1) % projects.length) + projects.length) % projects.length,
    );
  }
</script>

<div class="my-8 space-y-8 text-center">
  <div class="relative h-72">
    {#each shiftToProject(currentId) as project (project.id)}
      <ProjectItem
        img={project.img}
        desc={project.desc}
        id={project.id}
        on:click={clickHandler}
        {currentIdStore}
      />
    {/each}
  </div>
  <div>
    <p
      class="text-xs sm:text-sm motion-safe:transition-opacity {transitioning
        ? 'opacity-0'
        : 'opacity-100'}"
    >
      {projects[currentId].desc}
    </p>
  </div>
</div>
