<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import type { Database } from "../../../types/supabase";

  type Project = Database["public"]["Tables"]["projects"]["Row"];

  let projects: Project[] = [];
  let loading = true;

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");

    if (error) {
      console.error("Error fetching project:", error);
      return;
    }

    projects = data ?? [];
    loading = false;
  };

  onMount(() => {
    fetchProjects();
  });
</script>

<h1>Projects</h1>

{#if loading}
  <p>Loading projects...</p>
{:else if projects.length === 0}
  <p>No projects found.</p>
{:else}
  <ul>
    {#each projects as project}
      <li>
        <a href={`/works/${project.id}`}>
          <p>{project.name}</p>
        </a>
      </li>
    {/each}
  </ul>
{/if}
