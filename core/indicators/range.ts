import { Indicator, DataPoint } from './interface';

export class Range implements Indicator<DataPoint, number> {
  next(input: DataPoint): number {
    return input.high - input.low;
  }
}
