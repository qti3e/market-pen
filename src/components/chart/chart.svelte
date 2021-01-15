<script lang="ts">
  import { onMount } from 'svelte';
  import { Spline } from './spline';

  export let data: number[] = [];

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const points = data.map((y, x) => ({x: x * 10, y}));
    console.log(points);
    const ctx = canvas.getContext('2d');
    const path = new Spline(...points);
    path.draw(ctx, 0, 0, 1, 1);
  });
</script>

<canvas bind:this={canvas} style="width: 100%; height: 100%"></canvas>
