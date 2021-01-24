<script lang="ts">
  import uPlot from 'uplot';
  import type { Axis } from 'uplot';
  import type { Options } from '../chart/uplot/uPlot.svelte';
  import type { View } from '../../../core/compiler/view';
  import Chart from '../chart/uplot/uPlot.svelte';
  import { candlestickPlugin } from '../chart/uplot/candle';
  import { columnHighlightPlugin } from '../chart/uplot/column_highlight';
  import { legendAsTooltipPlugin } from '../chart/uplot/legend';

  export let view: View;
  export let timeData: number[];
  export let data: number[][];

  function fmtUSD(val: number, dec: number) {
    return '$' + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, '$&,');
  }

  const axes = (values: string | undefined = ''): Axis[] => [
    {
      show: true,
      stroke: '#fff',
      values: '',
      grid: {
        width: 1 / devicePixelRatio,
        stroke: '#2c3235',
      },
    },
    {
      show: true,
      stroke: '#fff',
      grid: {
        width: 1 / devicePixelRatio,
        stroke: '#2c3235',
      },
    },
  ];

  const fmtDate = uPlot.fmtDate('{YYYY}-{MM}-{DD} {HH}:{mm}');
  const tzDate = (ts: number) => new Date(ts * 1e3);

  const OHLCOptions: Options = {
    plugins: [
      columnHighlightPlugin({ className: 'bg-blue-100', style: { opacity: '0.5' } }),
      legendAsTooltipPlugin({ className: ['bg-primary-700', 'text-fg-primary', 'shadow-2xl'] }),
      candlestickPlugin(),
    ],
    series: [
      {
        label: 'Date',
        value: (_, ts) => fmtDate(tzDate(ts)),
      },
      {
        label: 'Open',
        value: (_, v) => fmtUSD(v, 2),
      },
      {
        label: 'High',
        value: (_, v) => fmtUSD(v, 2),
      },
      {
        label: 'Low',
        value: (_, v) => fmtUSD(v, 2),
      },
      {
        label: 'Close',
        value: (_, v) => fmtUSD(v, 2),
      },
      ...view.plots.map((plot) => ({
        label: plot.title,
        stroke: plot.color,
        width: 2,
        points: {
          show: false,
        },
      })),
    ],
    axes: axes(),
  };

  const OHLCData = [
    timeData,
    ...data.slice(0, 4),
    ...view.plots.map((plot) => data[plot.seriesIndex]),
  ] as any;
</script>

<Chart options={OHLCOptions} data={OHLCData} />
