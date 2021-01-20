<script lang="ts">
  import uPlot from 'uplot';
  import type { Options } from './uplot/uPlot.svelte';
  import Chart from './uplot/uPlot.svelte';
  import { candlestickPlugin } from './uplot/candle';
  import { columnHighlightPlugin } from './uplot/column_highlight';
  import { legendAsTooltipPlugin } from './uplot/legend';

  function fmtUSD(val: number, dec: number) {
    return '$' + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, '$&,');
  }

  function randInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const data: any = [[], [], [], [], [], [], []];

  // random data
  for (
    let i = 0, price = 1000, time = ((Date.now() / 1e3 / 300) | 0) * 300;
    i < 100;
    ++i, time += 5 * 60
  ) {
    let change = (Math.random() - 0.5) * 60;
    let open = price + Math.random() * 5;
    let close = open + change;
    let high = Math.max(open, close) + Math.random() * 20;
    let low = Math.min(open, close) - Math.random() * 20;
    data[0].push(time);
    data[1].push(open | 0);
    data[2].push(high | 0);
    data[3].push(low | 0);
    data[4].push(close | 0);
    data[5].push(randInt(10, 250));
    data[6].push((open + close) / 2 + Math.random() * 100);
    price += change;
  }

  const fmtDate = uPlot.fmtDate('{YYYY}-{MM}-{DD} {HH}:{mm}');
  const tzDate = (ts: number) => new Date(ts * 1e3);

  const options: Options = {
    plugins: [
      columnHighlightPlugin({ className: 'bg-blue-100', style: { opacity: '0.5' } }),
      legendAsTooltipPlugin({ className: ['bg-primary-700', 'text-fg-primary', 'shadow-2xl'] }),
      candlestickPlugin(),
    ],
    scales: {
      x: {
        distr: 2,
      },
      vol: {
        range: [0, 2500],
      },
    },
    series: [
      {
        label: 'Date',
        value: (u, ts) => fmtDate(tzDate(ts)),
      },
      {
        label: 'Open',
        value: (u, v) => fmtUSD(v, 2),
      },
      {
        label: 'High',
        value: (u, v) => fmtUSD(v, 2),
      },
      {
        label: 'Low',
        value: (u, v) => fmtUSD(v, 2),
      },
      {
        label: 'Close',
        value: (u, v) => fmtUSD(v, 2),
      },
      {
        label: 'Volume',
        scale: 'vol',
      },
      {
        label: 'Test',
        value: (u, v) => fmtUSD(v, 2),
        stroke: '#3B82F6',
        width: 2,
        points: {
          show: false,
        },
      },
    ],
    axes: [
      {
        show: true,
        stroke: '#fff',
        grid: {
          width: 1 / devicePixelRatio,
          stroke: '#2c3235',
        },
      },
      {
        show: false,
      },
    ],
  };
</script>

<Chart {options} {data} />
