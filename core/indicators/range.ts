import { Indicator, DataPoint } from './interface';

export class Range implements Indicator<DataPoint, number> {
  readonly isNumeric = true;

  next(input: DataPoint): number {
    return input.high - input.low;
  }
}
