<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Background from "$lib/components/background/Background.svelte";
  import Gnb from "$lib/components/gnb/Gnb.svelte";
  import "$lib/assets/styles/global.scss";
  import Lenis from "@studio-freight/lenis";
  import { gsap } from "gsap";

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

  /* ===============================
   * page transition
   * =============================== */
  let pageContainer: HTMLDivElement;

  $: $page.url.pathname, fadeIn();

  const fadeIn = () => {
    if (!pageContainer) return;

    gsap.fromTo(
      pageContainer,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        clearProps: "opacity",
      },
    );
  };

  export let data;
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="Frontend Portfolio" />
  <meta property="og:description" content="Frontend Portfolio" />
</svelte:head>

<Background />

<Gnb />

<div bind:this={pageContainer} class="page-wrapper">
  <slot />
</div>
