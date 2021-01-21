<style>
  .layout {
    grid-template-rows: 4rem 2.75rem repeat(2, 1fr);
  }
</style>

<script lang="ts">
  import Editor from '../components/monaco/editor.svelte';
  import Chart from '../components/chart/chart.svelte';
  import { Experiment } from '../../core/experiment';
  import { onMount } from 'svelte';

  export let eid: string;
  let status: 'loading' | 'error' | 'ok' = 'ok';

  let title: string = 'My market experiment!';
  let bookmarked = true;
  let periods = ['5M', '15M', '30M', '1H', '4H', '1D'];
  let period = '5M';

  let editor: Editor;
  let chart: Chart;
  let experiment: Experiment;

  function execute() {}

  function fork() {}

  onMount(async () => {
    console.log('EID', eid);
  });
</script>

{#if status === 'loading'}
  <div class="h-full flex items-center justify-center">
    <svg
      class="animate-spin h-15 w-16 text-fg-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
{:else if status === 'error'}
  <div class="h-full flex items-center justify-center">
    <p class="text-fg-primary">There was an error loading the experiment :(</p>
  </div>
{:else if status === 'ok'}
  <div class="grid grid-cols-2 grid-flow-col h-full layout bg-primary-700">
    <div
      class="col-span-2 rounded-tl-lg bg-secondary-500 shadow-2xl flex flex-row justify-between p-4"
    >
      <div class="flex flex-row items-center space-x-2">
        <button
          type="button"
          class="focus:outline-none"
          tabindex="-1"
          title={bookmarked ? 'Remove from favourites' : 'Save to favourites'}
          on:click={() => (bookmarked = !bookmarked)}>
          <svg
            class="w-8 h-8"
            class:text-yellow-300={bookmarked}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            /></svg
          >
        </button>

        <span
          class="text-fg-secondary font-serif text-sm block w-32 truncate border-b-2 border-dotted cursor-pointer"
          {title}>{title}</span
        >
      </div>

      <div class="flex flex-row items-center space-x-2">
        <button
          on:click={() => fork()}
          type="button"
          class="py-2 px-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none"
          tabindex="-1"> Fork </button>
      </div>
    </div>

    <div class="row-span-3 col-span-1">
      <Editor bind:this={editor} />
    </div>

    <div class="col-span-1 bg-primary-700 py-1 px-2 flex flex-row justify-between">
      <div class="flex-none flex flex-row items-center space-x-2">
        <button
          on:click={() => execute()}
          class="h-6 rounded-sm px-4 py-2 flex items-center justify-between text-secondary-500 text-sm font-small ring-2 ring-secondary-500 hover:bg-secondary-500 hover:text-fg-secondary">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            /><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          RUN
        </button>
      </div>
      <div class="flex-none flex flex-row items-center space-x-2">
        {#each periods as p}
          <button
            class="px-1 h-6 bg-primary-500 rounded-sm text-xs font-thin text-center focus:outline-none transition-colors"
            class:bg-primary-800={p === period}
            class:cursor-default={p === period}
            class:hover:bg-primary-800={p !== period}
            on:click={() => (period = p)}>
            {p}
          </button>
        {/each}
      </div>
    </div>

    <div class="col-span-1 row-span-2 bg-primary-800 flex flex-col">
      <Chart bind:this={chart} />
      <Chart />
    </div>
  </div>
{/if}
