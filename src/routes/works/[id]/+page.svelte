<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { Database } from "../../../../types/supabase";

  /* ===============================
   * types
   * =============================== */
  type Project = Database["public"]["Tables"]["projects"]["Row"];

  /* ===============================
   * state
   * =============================== */
  let project: Project | null = null;
  let loading = true;
  let errorMessage = "";

  /* ===============================
   * route params
   * =============================== */
  let projectId: number | undefined;

  $: {
    const id = $page.params.id;
    projectId = id ? Number(id) : undefined;
  }

  /* ===============================
   * data fetch
   * =============================== */
  const fetchProject = async () => {
    if (!projectId) {
      loading = false;
      errorMessage = "잘못된 접근입니다.";
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) {
      errorMessage = "프로젝트를 찾을 수 없습니다.";
      project = null;
    } else {
      project = data;
    }

    loading = false;
  };

  /* ===============================
   * lifecycle
   * =============================== */
  onMount(() => {
    fetchProject();
  });
</script>

<div class="page">
  <h1>Project Details</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if errorMessage}
    <p>{errorMessage}</p>
  {:else if project}
    <div>
      <h2>{project.name}</h2>
      <p>{project.desc}</p>
    </div>
  {/if}

  <a href="/works">Back to Projects</a>
</div>
