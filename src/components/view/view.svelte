<script lang="ts">
  import uPlot from 'uplot';
  import type { Axis, Series } from 'uplot';
  import type { Options } from './uplot/uPlot.svelte';
  import type { Indicator, Plot, View } from '../../../core/compiler/view';
  import Chart from './uplot/uPlot.svelte';
  import { candlestickPlugin } from './uplot/candle';
  import { columnHighlightPlugin } from './uplot/column_highlight';
  import { legendAsTooltipPlugin } from './uplot/legend';
  import { indicatorBarPlugin } from './uplot/indicator_bar';

  export let view: View;
  export let timeData: number[];
  export let data: number[][];

  const barOptions: { open: number[]; close: number[] } = { open: [], close: [] };

  const cursorOpts = {
    lock: true,
    focus: {
      prox: 16,
    },
    sync: {
      key: 'view' + Math.random(),
      setSeries: true,
    },
  };

  const axes = (values: string | undefined = ''): Axis[] => [
    {
      show: false,
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

  function optionsForIndicator(indicator: Indicator): Options {
    const plugins = [
      columnHighlightPlugin({ className: 'bg-blue-100', style: { opacity: '0.5' } }),
      legendAsTooltipPlugin(),
    ];

    if (indicator.type === 'bar') plugins.push(indicatorBarPlugin(barOptions));

    return {
      plugins,
      cursor: cursorOpts,
      series: [
        {
          label: 'Date',
          value: (_, ts) => fmtDate(tzDate(ts)),
        },
        {
          label: indicator.title,
          stroke: '#ff0',
          points: {
            show: false,
          },
        },
        ...indicator.plots.map((plot) => seriesForPlot(plot)),
      ],
      axes: axes(),
    };
  }

  function seriesForPlot(plot: Plot): Series {
    return {
      label: plot.title,
      stroke: plot.color,
      width: 2,
      points: {
        show: false,
      },
    };
  }

  const fmtDate = uPlot.fmtDate('{YYYY}-{MM}-{DD} {HH}:{mm}');
  const tzDate = (ts: number) => new Date(ts * 1e3);

  const OHLCBaseSeries: Series[] = [
    {
      label: 'Date',
      value: (_, ts) => fmtDate(tzDate(ts)),
    },
    {
      label: 'O',
    },
    {
      label: 'H',
    },
    {
      label: 'L',
    },
    {
      label: 'C',
    },
  ];

  let indicatorsOptions: Options[];
  let indicatorsData: any[];
  let OHLCData: any;
  let OHLCOptions: Options = {
    plugins: [
      columnHighlightPlugin({ className: 'bg-blue-100', style: { opacity: '0.5' } }),
      legendAsTooltipPlugin({ className: ['text-gray-200'] }),
      candlestickPlugin(),
    ],
    cursor: cursorOpts,
    series: [],
    axes: axes(),
  };

  $: {
    OHLCData = [timeData, ...data.slice(0, 4), ...view.plots.map((plot) => data[plot.seriesIndex])];
    indicatorsData = view.indicators.map((indicator) => [
      timeData,
      data[indicator.seriesIndex],
      ...indicator.plots.map((plot) => data[plot.seriesIndex]),
    ]);
    barOptions.open = data[0];
    barOptions.close = data[3];
  }

  $: {
    OHLCOptions.series = [...OHLCBaseSeries, ...view.plots.map((plot) => seriesForPlot(plot))];
    indicatorsOptions = view.indicators.map((indicator) => optionsForIndicator(indicator));
  }
</script>

<div class="w-full flex-grow">
  <Chart options={OHLCOptions} data={OHLCData} />
</div>

{#each indicatorsOptions as opts, index}
  <div class="w-full h-40">
    <Chart options={opts} data={indicatorsData[index]} />
  </div>
{/each}
