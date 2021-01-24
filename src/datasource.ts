import { ChartData } from '../core/experiment';

export interface DataSource {
  time: number[];
  chart: ChartData;
}

export function getDataSource(): DataSource {
  const time: number[] = [];
  const chart: ChartData = [];

  function randInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (
    let i = 0, price = 1000, t = ((Date.now() / 1e3 / 300) | 0) * 300;
    i < 100;
    ++i, t += 5 * 60
  ) {
    let change = (Math.random() - 0.5) * 60;
    let open = price + Math.random() * 5;
    let close = open + change;
    let high = Math.max(open, close) + Math.random() * 20;
    let low = Math.min(open, close) - Math.random() * 20;
    time.push(t);
    chart.push([open | 0, high | 0, low | 0, close | 0, randInt(10, 250)]);
    price += change;
  }

  return {
    time,
    chart,
  };
}
