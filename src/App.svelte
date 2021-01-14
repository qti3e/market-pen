<style global>
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;
</style>

<script lang="ts">
  export let name: string;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p class="p-2">
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte
    apps.
  </p>
</main>
