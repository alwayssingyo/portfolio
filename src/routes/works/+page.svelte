<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount, tick } from "svelte";
  import type { Database } from "../../../types/supabase";
  import "$lib/assets/styles/page.scss";
  import { gsap } from "gsap";

  /* ===============================
   * types
   * =============================== */
  type Project = Database["public"]["Tables"]["projects"]["Row"];

  /* ===============================
   * state
   * =============================== */
  let projects: Project[] = [];
  let loading = true;

  /* ===============================
   * data fetch
   * =============================== */
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching project:", error);
      return;
    }

    projects = data ?? [];
    loading = false;

    animateListIn();
  };

  /* ===============================
   * list intro animation
   * =============================== */
  const animateListIn = async () => {
    await tick();

    gsap.from(".project-item", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.04,
    });
  };

  /* ===============================
   * color palette
   * =============================== */
  const baseColors = [
    [0.85, 0.92, 0.92], // teal
    [0.7, 0.85, 0.85], // aqua
    [1.0, 0.8, 0.85], // lavender
    [0.9, 0.9, 0.7], // lemon
  ].map(([r, g, b]) => ({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }));

  /* ===============================
   * color helpers
   * =============================== */
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const lerpColor = (
    c1: { r: number; g: number; b: number },
    c2: { r: number; g: number; b: number },
    t: number,
  ) => ({
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  });

  /* ===============================
   * gradient generator
   * =============================== */
  const getGradientColors = (index: number, total: number) => {
    const t = total <= 1 ? 0 : index / (total - 1);
    const segment = (baseColors.length - 1) * t;
    const i = Math.floor(segment);
    const localT = segment - i;

    const from = baseColors[i];
    const to = baseColors[Math.min(i + 1, baseColors.length - 1)];

    return {
      from: lerpColor(from, to, localT),
      to: lerpColor(to, from, localT * 0.5),
    };
  };

  /* ===============================
   * device check
   * =============================== */
  const isMobile = () => window.innerWidth <= 768;

  /* ===============================
   * interactions
   * =============================== */
  const manageMouseEnter = (
    e: MouseEvent & { currentTarget: HTMLAnchorElement },
    index: number,
  ) => {
    if (isMobile()) return;

    const { from, to } = getGradientColors(index, projects.length);

    gsap.to(e.currentTarget, {
      y: "-20px",
      duration: 0.3,
      ease: "power2.out",
      "--g1": `${from.r}, ${from.g}, ${from.b}`,
      "--g2": `${to.r}, ${to.g}, ${to.b}`,
    });
  };

  const manageMouseLeave = (
    e: MouseEvent & { currentTarget: HTMLAnchorElement },
  ) => {
    if (isMobile()) return;

    gsap.to(e.currentTarget, {
      y: "0",
      duration: 0.3,
      delay: 0.1,
      ease: "power2.out",
      "--g1": "255, 255, 255",
      "--g2": "255, 255, 255",
    });
  };

  /* ===============================
   * lifecycle
   * =============================== */
  onMount(() => {
    fetchProjects();
  });
</script>

<div class="page">
  {#if loading}{:else if projects.length === 0}
    <div class="project-empty">No projects found</div>
  {:else}
    <div class="project-container">
      {#each projects as project, index}
        <a
          href={`/works/${project.id}`}
          class="project-item"
          on:mouseenter={(e) => manageMouseEnter(e, index)}
          on:mouseleave={(e) => manageMouseLeave(e)}
        >
          {project.name}
        </a>
      {/each}
    </div>
  {/if}
</div>
