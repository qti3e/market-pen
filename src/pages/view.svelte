<script lang="ts">
  import Editor from '../components/monaco/editor.svelte';
  import Chart from '../components/chart/chart.svelte';

  let editor: Editor;
  let chart: Chart;

  let data = Array(100).fill(null).map(_ => Math.random() * 500);
</script>

<div class="flex flex-col h-full">
  <div class="h-16 rounded-tl-lg bg-primary-800 flex flex-row justify-between p-4">
    <div class="flex flex-row items-center space-x-2">
      <div class="rounded-full bg-red-200 w-8 h-8" />
      <span class="text-fg-primary font-serif text-sm block w-32 truncate border-b-2 border-dotted cursor-pointer" title="My Amazing Notebook that I just love">My Amazing Notebook that I just love</span>
    </div>
    <div class="flex flex-row items-center space-x-2">
      <div class="rounded-full bg-red-200 w-8 h-8" />
      <div class="rounded-full bg-red-200 w-8 h-8" />
      <div class="rounded-full bg-red-200 w-8 h-8" />
    </div>
  </div>

  <div class="flex-auto flex">
    <div class="flex-auto">
      <Editor bind:this={editor} />
    </div>
    <div class="w-1/2">
      <Chart bind:this={chart} data={data} />
    </div>
  </div>
</div>
