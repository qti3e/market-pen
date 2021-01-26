<script lang="ts">
  import { onMount } from 'svelte';
  import { WindowRPC } from '../../core/rpc';

  let data = 'Hello World';

  export let channelId: string;
  const rpc = new WindowRPC(window.opener, channelId);

  rpc.start({
    setText(text: string) {
      data = text;
    },
  });

  function onbeforeunload() {
    rpc.call('closed');
    rpc.stop();
  }

  onMount(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    }
  })
</script>

{data}
