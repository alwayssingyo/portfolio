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
  };

  /* ===============================
   * supabase image helper
   * =============================== */
  const getImageUrl = (path?: string | null): string => {
    if (!path) return "";

    return supabase.storage.from("projects").getPublicUrl(path).data.publicUrl;
  };

  /* ===============================
   * image error handler
   * =============================== */
  let imageErrorMap: Record<number, boolean> = {};
  const handleImageError = (id: number) => {
    imageErrorMap = {
      ...imageErrorMap,
      [id]: true,
    };
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
        <div class="project-item">
          <a href={`/works/${project.id}`} class="top">
            <div class="card">
              {#if project.img_url && !imageErrorMap[project.id]}
                <img
                  class="img"
                  src={getImageUrl(project.img_url)}
                  alt={project.name}
                  loading="lazy"
                  on:error={() => handleImageError(project.id)}
                />
              {:else}
                <div class="img-fallback"></div>
              {/if}
            </div>
          </a>
          <a href={`/works/${project.id}`} class="bottom">
            <div class="title">{project.name}</div>
            <div class="category">{project.category}</div>
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>
