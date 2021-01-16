import { Flow } from './api/flow';
import { DataPoint } from './indicators/interface';

/// Calling eval by reference executes the code in the global context.
const e = eval;

/**
 * A compiled program that is ready to analyze to data.
 */
export interface Program {
  /**
   * The UI layout, think of it as a template, the data returned from `next` is used to render
   * this template.
   */
  layout: unknown,
  /**
   * Insert a new candle.
   *
   * @param data The current OHLCV data.
   */
  next(data: DataPoint): Record<string, number>;
}

/**
 * Take the JS code created by a user and transform it into a program.
 * 
 * This transformation involves executing the given JS code, so ensure that you're in
 * a safe sandbox before trying to invoke this function.
 */
export function compile(code: string): Program {
  const result = [
    '(function ($, watch, plot) {',
    code,
    '})'
  ].join('\n');

  // TODO(qti3e) Make `watch` and `plot`.
  const $ = Flow.root;
  e(result)($);

  throw new Error("Not implemented.")
}
