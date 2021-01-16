import { Indicator, DataPoint } from './interface';

export class TrueRange implements Indicator {
  private prev_close: number | number = null;

  next(input: DataPoint | number): number {
    const prev_close = this.prev_close;
    if (typeof input === 'number') {
      this.prev_close = input;
      return prev_close === null ? 0.0 : Math.abs(input - prev_close);
    } else if (prev_close === null) {
      this.prev_close = input.close;
      return input.high - input.low;
    } else {
      this.prev_close = input.close;
      const dist1 = input.high - input.low;
      const dist2 = Math.abs(input.high - prev_close);
      const dist3 = Math.abs(input.low - prev_close);
      return Math.max(dist1, dist2, dist3);
    }
  }
}
