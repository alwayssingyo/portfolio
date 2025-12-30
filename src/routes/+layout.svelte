<script lang="ts">
  import { onMount } from "svelte";
  import Gnb from "$lib/components/gnb/Gnb.svelte";
  import "$lib/assets/styles/global.scss";
  import Lenis from "@studio-freight/lenis";

  let lenis: Lenis;
  let rafId: number;

  onMount(() => {
    lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);
  });

  export let data;
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="Frontend Portfolio" />
  <meta property="og:description" content="Frontend Portfolio" />
</svelte:head>

<Gnb />

<slot />
