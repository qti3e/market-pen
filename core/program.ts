import { DataPoint } from './indicators/interface';

/**
 * A compiled program that is ready to analyze to data.
 */
export interface Program {
  /**
   * The UI layout, think of it as a template, the data returned from `next` is used to render
   * this template.
   */
  layout: unknown;
  /**
   * Insert a new candle.
   *
   * @param data The current OHLCV data.
   */
  next(data: DataPoint): Record<string, number>;
}
