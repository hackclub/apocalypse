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
      img: "https://cloud-j21vy98xg-hack-club-bot.vercel.app/0image.png",
      desc: "a Tetris game to keep you engaged.",
      credit: "CodeDay Singapore",
      creditLink: "https://event.codeday.org/singapore",
      id: 2,
    },
    {
      img: "https://cloud-41r29esrv-hack-club-bot.vercel.app/0image.png",
      desc: "make projects with both hardware and software ",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 3,
    },
    {
      img: "https://cloud-nxorlq2pb-hack-club-bot.vercel.app/0image.png",
      desc: "use hardware to hack a power strip and make it smart.",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 4,
    },
    {
      img: "https://cloud-28zkbdyiw-hack-club-bot.vercel.app/0image.png",
      desc: "share your solution with other hackers",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 5,
    },
    {
      img: "https://cloud-nim9qlg72-hack-club-bot.vercel.app/0image.png",
      desc: "attend workshops to learn new skills",
      credit: "Assemble",
      creditLink: "https://assemble.hackclub.com",
      id: 6,
    },
    {
      img: "https://cloud-j0si02yx8-hack-club-bot.vercel.app/0image.png",
      desc: "a platformer game to train your skills",
      credit: "Forsyth Hacks",
      creditLink: "https://forsythhacks.dev/",
      id: 7,
    },
    {
      img: "https://cloud-q2a10np6i-hack-club-bot.vercel.app/0image.png",
      desc: "incorporate Artificial Intelligence in your project",
      credit: "Forsyth Hacks",
      creditLink: "https://forsythhacks.dev/",
      id: 8,
    },
    {
      img: "https://cloud-3rihbs4d0-hack-club-bot.vercel.app/0image.png",
      desc: "recognize and translate sign language.",
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
