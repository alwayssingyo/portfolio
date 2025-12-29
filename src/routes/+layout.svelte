<script>
  import Gnb from "$lib/components/gnb/Gnb.svelte";
  import "$lib/assets/styles/global.scss";

  export let data;
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Gnb />

<slot />
