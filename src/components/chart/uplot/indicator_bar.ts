// Candlestick plugin for uPlot
import uPlot, { Plugin } from 'uplot';

export interface IndicatorBarOptions {
  open: number[];
  close: number[];
  timeSeries: number;
  volumeSeries: number;
  gap: number;
  bearishColor: string;
  bullishColor: string;
  bodyMaxWidth: number;
  shadowWidth: number;
}

const DEFAULT_OPTIONS = Object.freeze({
  open: [],
  close: [],
  timeSeries: 0,
  volumeSeries: 1,
  gap: 1,
  bearishColor: '#e54245',
  bullishColor: '#4ab650',
  bodyMaxWidth: 20,
  shadowWidth: 2,
});

export function indicatorBarPlugin(options: Partial<IndicatorBarOptions> = {}): Plugin {
  const { gap, bearishColor, bullishColor, bodyMaxWidth, shadowWidth, timeSeries, volumeSeries } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  function drawBars(u: uPlot) {
    u.ctx.save();
    const offset = (shadowWidth % 2) / 2;

    u.ctx.translate(offset, offset);

    let [iMin, iMax] = u.series[0].idxs;

    let value0AsY = u.valToPos(0, 'y', true);

    for (let i = iMin; i <= iMax; i++) {
      let xVal = u.scales.x.distr == 2 ? i : u.data[timeSeries][i];
      let vol = u.data[volumeSeries][i];

      let timeAsX = u.valToPos(xVal, 'x', true);
      let valueAsY = u.valToPos(vol, 'y', true);

      let bodyColor = options.open[i] > options.close[i] ? bearishColor : bullishColor;
      let shadowColor = bodyColor;

      u.ctx.fillStyle = shadowColor;

      // body rect
      let columnWidth = u.bbox.width / (iMax - iMin);
      let bodyWidth = Math.min(bodyMaxWidth, columnWidth - gap);
      let bodyX = timeAsX - bodyWidth / 2;
      u.ctx.fillStyle = bodyColor;
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(valueAsY),
        Math.round(bodyWidth),
        Math.round(value0AsY - valueAsY)
      );
    }

    u.ctx.translate(-offset, -offset);
    u.ctx.restore();
  }

  return {
    opts(_, opts) {
      uPlot.assign(opts, {
        cursor: {
          points: {
            show: false,
          },
        },
      });

      const series = opts.series[volumeSeries];
      series.paths = () => null;
      series.points = { show: false };
    },
    hooks: {
      drawAxes: drawBars,
    },
  };
}
