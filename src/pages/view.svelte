<script lang="ts">
  import Editor from '../components/monaco/editor.svelte';
  import Chart from '../components/chart/chart.svelte';
  import { Experiment } from '../../core/experiment';
  import type { ChartData } from '../../core/experiment';
  import { onMount } from 'svelte';

  let editor: Editor;
  let chart: Chart;

  const data: ChartData = [];
  for (
    let i = 0, price = 1000, time = ((Date.now() / 1e3 / 300) | 0) * 300;
    i < 30;
    ++i, time += 5 * 60
  ) {
    let change = (Math.random() - 0.5) * 60;
    let open = price + Math.random() * 5;
    let close = open + change;
    let high = Math.max(open, close) + Math.random() * 20;
    let low = Math.min(open, close) - Math.random() * 20;
    data.push([open, high, low, close, (Math.random() * 240 + 10) | 0]);
    price += change;
  }

  const experiment = new Experiment({});

  onMount(async () => {
    await experiment.setData(data);
    const layout = await experiment.setSourceCode(`// Demo
const sma3 = pin($.ta.simple_moving_average(3));
const sma2 = pin($.ta.simple_moving_average(2));
$(_ => {
  console.log('SMA-3: ', sma3.data());
  console.log('SMA-2: ', sma2.data());
});`);
    experiment.execute();
  });
</script>

<div class="flex flex-col h-full">
  <div class="h-16 rounded-tl-lg bg-secondary-500 shadow-2xl flex flex-row justify-between p-4">
    <div class="flex flex-row items-center space-x-2">
      <div class="rounded-full bg-red-200 w-8 h-8" />
      <span
        class="text-fg-secondary font-serif text-sm block w-32 truncate border-b-2 border-dotted cursor-pointer"
        title="My Amazing Notebook that I just love">My Amazing Notebook that I just love</span
      >
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
    <div class="w-1/2 bg-primary-800">
      <Chart bind:this={chart} />
    </div>
  </div>
</div>
