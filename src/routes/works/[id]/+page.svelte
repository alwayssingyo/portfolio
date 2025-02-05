<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import type { Database } from '../../../../types/supabase';
  
    type Project = Database['public']['Tables']['projects']['Row'];
  
    let project: Project | null = null;
    let loading = true;
    let errorMessage = '';
  
    let projectId: number | undefined;
    $: projectId = $page.params.id ? Number($page.params.id) : undefined;
  
    const fetchProject = async () => {
      if (!projectId) return;
  
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
  
      if (error) {
        console.error('Error fetching project:', error);
        errorMessage = '프로젝트를 찾을 수 없습니다.';
      } else {
        project = data;
      }
  
      loading = false;
    };
  
    onMount(() => {
      fetchProject();
    });
  </script>
  
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