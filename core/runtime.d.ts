import { Primitive, Candle } from './build/api/operation';
import { DataPoint } from './build/indicators/interface';
import { ComputationNode } from './build/api/nodes';
import { PlotSource, IndicatorOptions } from './build/compiler/global';

// Declaration file for global variables in the market-watch runtime.

type WatchCB<T> = (data: Exclude<T, null>, isFinal: boolean) => void;

interface $ extends Candle {
  /**
   * Transform a primitive JS number into a computation node that can be used
   * in equations.
   *
   * # Example
   * ```js
   * $(10).div(2);
   * ```
   */
  (n: number): Primitive;
  /**
   * Register a callback function to be called for each candle.
   *
   * # Example
   * ```js
   * const high20 = $.ta.high(20);
   * const prevHigh20 = high20.delay(1);
   *
   * $((candle, _isFinal) => {
   *   if (candle.high > prevHigh20) log('New High!');
   * })
   * ```
   */
  (cb: WatchCB<DataPoint>): void;
}

/**
 * A reactive-variable containing the current data for the candle.
 *
 * By default when used in math expressions or indicators that work only on a primitive
 * numeric value, the closing price is used.
 *
 * # Example
 * ```js
 * const SMA15 = $.ta.SMA(15);
 * const SMA30 = $.ta.SMA(30);
 * const Ratio = SMA15.div(SMA30).mul(100);
 *
 * // Compute the Simple Moving Average of the volume!
 * const VolumeAvg30 = $.volume.ta.SMA(30);
 * ```
 */
declare const $: $;

/**
 * Register a callback that gets called whenever the value of node changes.
 */
declare function watch<T>(node: ComputationNode<T>, cb: WatchCB<T>, skipFirst?: boolean): void;

declare namespace watch {
  /**
   * Always call the callback, even if the value is unchanged.
   */
  export function always<T>(node: ComputationNode<T>, cb: WatchCB<T>): void;
}

declare function pin<T>(source: ComputationNode<T>): ComputationNode<T>;

/**
 * Plot a line on the main OHLCV chart.
 *
 * @param title Human-readable name of this plot.
 * @param source The data source, either a function or a reactive-value.
 * @param type What shape should be used to draw this?
 * @param color An optional value for color.
 */
declare function plot(
  title: string,
  source: PlotSource,
  type?: 'line' | 'point' | 'bar' | 'step',
  color?: string
): void;

/**
 * Create a new indicator.
 * @param title Name of the indicator.
 * @param source Either a function or a reactive-value used as y-axis.
 * @param options
 */
declare function indicator(
  title: string,
  source: PlotSource,
  options?: Partial<IndicatorOptions>
): IndicatorResult;

interface IndicatorResult {
  /**
   * Plot a line over the indicator.
   * @param title
   * @param source
   * @param color
   */
  line(title: string, source: PlotSource, color?: string): IndicatorResult;
  bar(title: string, source: PlotSource, color?: string): IndicatorResult;
  step(title: string, source: PlotSource, color?: string): IndicatorResult;
  point(title: string, source: PlotSource, color?: string): IndicatorResult;
  asLine(): IndicatorResult;
}
