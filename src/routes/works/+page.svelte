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
      {#each projects as project}
        <a href={`/works/${project.id}`} class="project-item">
          <div class="project-item-id">
            {project.id}
          </div>
          <div class="project-item-text">
            <div class="title">
              <span class="client">
                {#if project.client}
                  {project.client}<br />
                {/if}</span
              >
              {project.name}
            </div>
            <div class="category">
              {project.category}
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
