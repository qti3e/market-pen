<style>
  @import 'uplot/dist/uPlot.min.css';

  :global(.u-select) {
    background: rgba(255, 255, 255, 0.07);
  }

  :global(.u-value) {
    font-weight: bold;
  }
</style>

<script context="module" lang="ts">
  import type { Options as uPlotOptions } from 'uplot';
  export type Options = Omit<uPlotOptions, 'width' | 'height'>;
</script>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Data } from 'uplot';
  import uPlot from 'uplot';

  // Props:
  export let options: Options;
  export let data: Data;

  let outer: HTMLDivElement;
  let container: HTMLDivElement;
  let chart: uPlot;
  let prevWidth: number, prevHeight: number;

  onMount(() => {
    draw(options);
    setTimeout(resize, 700);
    setTimeout(resize, 1500);
  });

  onDestroy(() => destroy());

  function resize() {
    if (!chart) return;
    const width = outer.clientWidth;
    const height = outer.clientHeight;
    if (width === prevWidth && height === prevHeight) return;
    prevWidth = width;
    prevHeight = height;
    chart.setSize({ width, height });
  }

  function destroy() {
    if (!chart) return;
    chart.destroy();
    chart = undefined;
    prevHeight = undefined;
    prevWidth = undefined;
  }

  function draw(options: Options) {
    destroy();
    chart = new uPlot(
      {
        width: (prevWidth = outer.clientWidth),
        height: (prevHeight = outer.clientHeight),
        ...options,
      },
      data,
      container
    );
  }

  $: if (chart) draw(options);
  $: if (chart) chart.setData(data);
</script>

<svelte:window on:resize={resize} />

<div bind:this={outer} style="position: relative; overflow: hidden; width: 100%; height: 100%;">
  <div bind:this={container} style="position: absolute;" />
</div>
