<script lang="ts">
  import { writable } from "svelte/store";
  import ProjectItem from "./ProjectItem.svelte";

  let projects = [
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/12a_large.jpeg",
      desc: "a flamethrower made from a toy guitar and a sunscreen bottle, that blows flames when played! (please don't use fire indoors)",
      credit: "Outernet",
      creditLink: "https://outernet.hackclub.com",
      id: 0,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/01_large.jpeg",
      desc: "a maze to help you navigate the zombified world, made with Sprig and JavaScript!",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 1,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/910a_large.jpeg",
      desc: "Tetris, for when you're bored in the bunkers",
      credit: "CodeDay Singapore",
      creditLink: "https://event.codeday.org/singapore",
      id: 2,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/89a_large.jpeg",
      desc: "prototype your anti-zombie arm",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 3,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/78a_large.jpeg",
      desc: "hack your power strip, and make it smart!",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 4,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/67a_large.jpeg",
      desc: "share what you're making with other hackers",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 5,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/56a_large.jpeg",
      desc: "attend workshops to learn new skills",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 6,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/45a_large.jpeg",
      desc: "a platformer game to train your zombie-fighting skills",
      credit: "Forsyth Hacks",
      creditLink: "https://forsythhacks.dev/",
      id: 7,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/34a_large.jpeg",
      desc: "use AI to monitor for zombies",
      credit: "Forsyth Hacks",
      creditLink: "https://forsythhacks.dev/",
      id: 8,
    },
    {
      img: "https://cloud-b8e9o4j5l-hack-club-bot.vercel.app/23a_large.jpeg",
      desc: "auto-translate sign languages",
      credit: "Lion City Hacks",
      creditLink: "https://lioncityhacks.com/",
      id: 9,
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
