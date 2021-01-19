import { Indicator, DataPoint } from './interface';
import { Delay } from '../helpers/delay';

export class SimpleMovingAverage implements Indicator<DataPoint | number, number | null> {
  readonly isNumeric = true;
  private readonly buffer: Delay<number>;
  private size = 0;
  private sum = 0;

  constructor(readonly period: number) {
    this.buffer = new Delay(period);
  }

  next(input: DataPoint | number): number | null {
    const close = typeof input === 'number' ? input : input.close;
    const first = this.buffer.insert(close);

    if (first === undefined) {
      this.sum += close;
      if (++this.size < this.period) return null;
    } else {
      this.sum += close - first;
    }

    return this.sum / this.period;
  }
}
