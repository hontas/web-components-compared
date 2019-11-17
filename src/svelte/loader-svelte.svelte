<script>
  export let messageHasLoaded = 'boom done.';
  export let messageLoading = 'loading...';
  export let loading = false;

  $: message = loading ? messageLoading : messageHasLoaded;
</script>

<svelte:options tag="loader-svelte" />
<p>{message}</p>
