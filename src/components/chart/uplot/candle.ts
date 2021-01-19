// Candlestick plugin for uPlot
import uPlot, { Plugin } from 'uplot';

export interface CandleStickOptions {
  timeSeries: number;
  openSeries: number;
  highSeries: number;
  lowSeries: number;
  closeSeries: number;
  volumeSeries: number;
  gap: number;
  bearishColor: string;
  bullishColor: string;
  bodyMaxWidth: number;
  shadowWidth: number;
  bodyOutline: number;
}

const DEFAULT_OPTIONS = Object.freeze({
  timeSeries: 0,
  openSeries: 1,
  highSeries: 2,
  lowSeries: 3,
  closeSeries: 4,
  volumeSeries: 5,
  gap: 1,
  bearishColor: '#e54245',
  bullishColor: '#4ab650',
  bodyMaxWidth: 20,
  shadowWidth: 2,
  bodyOutline: 1,
});

export function candlestickPlugin(options: Partial<CandleStickOptions> = {}): Plugin {
  const {
    gap,
    bearishColor,
    bullishColor,
    bodyMaxWidth,
    shadowWidth,
    bodyOutline,
    timeSeries,
    openSeries,
    highSeries,
    lowSeries,
    closeSeries,
    volumeSeries,
  } = { ...DEFAULT_OPTIONS, ...options };

  function drawCandles(u: uPlot) {
    u.ctx.save();
    const offset = (shadowWidth % 2) / 2;

    u.ctx.translate(offset, offset);

    let [iMin, iMax] = u.series[0].idxs;

    let vol0AsY = u.valToPos(0, 'vol', true);

    for (let i = iMin; i <= iMax; i++) {
      let xVal = u.scales.x.distr == 2 ? i : u.data[timeSeries][i];
      let open = u.data[openSeries][i];
      let high = u.data[highSeries][i];
      let low = u.data[lowSeries][i];
      let close = u.data[closeSeries][i];
      let vol = u.data[volumeSeries][i];

      let timeAsX = u.valToPos(xVal, 'x', true);
      let lowAsY = u.valToPos(low, 'y', true);
      let highAsY = u.valToPos(high, 'y', true);
      let openAsY = u.valToPos(open, 'y', true);
      let closeAsY = u.valToPos(close, 'y', true);
      let volAsY = u.valToPos(vol, 'vol', true);

      let bodyColor = open > close ? bearishColor : bullishColor;
      let shadowColor = bodyColor;

      // shadow rect
      let shadowHeight = Math.max(highAsY, lowAsY) - Math.min(highAsY, lowAsY);
      let shadowX = timeAsX - shadowWidth / 2;
      let shadowY = Math.min(highAsY, lowAsY);

      u.ctx.fillStyle = shadowColor;
      u.ctx.fillRect(
        Math.round(shadowX),
        Math.round(shadowY),
        Math.round(shadowWidth),
        Math.round(shadowHeight)
      );

      // body rect
      let columnWidth = u.bbox.width / (iMax - iMin);
      let bodyWidth = Math.min(bodyMaxWidth, columnWidth - gap);
      let bodyHeight = Math.max(closeAsY, openAsY) - Math.min(closeAsY, openAsY);
      let bodyX = timeAsX - bodyWidth / 2;
      let bodyY = Math.min(closeAsY, openAsY);

      u.ctx.fillStyle = shadowColor;
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(bodyY),
        Math.round(bodyWidth),
        Math.round(bodyHeight)
      );

      u.ctx.fillStyle = bodyColor;
      u.ctx.fillRect(
        Math.round(bodyX + bodyOutline),
        Math.round(bodyY + bodyOutline),
        Math.round(bodyWidth - bodyOutline * 2),
        Math.round(bodyHeight - bodyOutline * 2)
      );

      // volume rect
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(volAsY),
        Math.round(bodyWidth),
        Math.round(vol0AsY - volAsY)
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

      const seriesKey = [openSeries, highSeries, lowSeries, closeSeries, volumeSeries];
      for (let i = 0; i < 5; ++i) {
        const key = seriesKey[i];
        const series = opts.series[key];
        series.paths = () => null;
        series.points = { show: false };
      }
    },
    hooks: {
      drawClear: drawCandles,
    },
  };
}
