import { Indicator, DataPoint } from './interface';

export class TrueRange implements Indicator<DataPoint | number, number> {
  readonly isNumeric = true;
  private prevClose: number | null = null;

  next(input: DataPoint | number): number {
    const prev = this.prevClose;
    if (typeof input === 'number') {
      this.prevClose = input;
      return prev === null ? 0.0 : Math.abs(input - prev);
    } else if (prev === null) {
      this.prevClose = input.close;
      return input.high - input.low;
    } else {
      this.prevClose = input.close;
      const dist1 = input.high - input.low;
      const dist2 = Math.abs(input.high - prev);
      const dist3 = Math.abs(input.low - prev);
      return Math.max(dist1, dist2, dist3);
    }
  }
}
