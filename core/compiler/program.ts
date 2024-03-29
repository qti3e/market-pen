import { View } from './view';
import { DataPoint } from '../indicators/interface';
import { ComputationNode } from '../api/nodes';

export interface TickResult {
  series: number[];
  // TODO(qti3e) Shapes, Signals, Messages & Alerts.
}

export class Program {
  constructor(
    readonly view: View,
    readonly numSeries: number,
    readonly plan: ReadonlyArray<ComputationNode>
  ) {}

  next(data: DataPoint): TickResult {
    const { plan } = this;
    const series = [data.open, data.high, data.low, data.close, data.volume];
    const ctx = {
      $: data,
      series,
    };

    for (let i = 0, n = plan.length; i < n; ++i) plan[i].next(ctx);

    return {
      series,
    };
  }
}
