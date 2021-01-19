import { DataPoint } from '../indicators/interface';

const NOT_SET = Symbol('NOT_SET');

export interface ExecutionContext {
  $: DataPoint;
  series: number[];
}

export abstract class ComputationNode<O = any, I = unknown> {
  /** @internal */
  _data: O | typeof NOT_SET = NOT_SET;

  /**
   * Return the list of nodes that this node is depended on.
   * @internal
   */
  abstract predecessors(): ComputationNode<I>[];

  /**
   * Compute the next data and set it to `this._data`.
   * You are allowed to change the internal state.
   * @param ctx The execution context for current time.
   * @internal
   */
  abstract next(ctx: ExecutionContext): void;

  /**
   * Return the last computed data for this node.
   */
  data(): O {
    if (this._data === NOT_SET) throw new Error(`You're not allowed to use the data yet.`);
    return this._data;
  }

  valueOf(): O {
    if (this._data === NOT_SET) throw new Error(`You're not allowed to use the data yet.`);
    return this._data;
  }
}

export type WatchCB<T> = (data: Exclude<T, null>, isFinal: boolean) => void;

export class WatchChangeNode<T> extends ComputationNode<never, T> {
  private prev: T | typeof NOT_SET = NOT_SET;

  constructor(readonly source: ComputationNode<T>, readonly cb: WatchCB<T>, private skip = false) {
    super();
  }

  predecessors() {
    return [this.source];
  }

  next() {
    const prev = this.prev;
    const current = this.source._data as T;
    if (current === prev) return;
    this.prev = current;
    if (current === null) return;
    if (this.skip) {
      this.skip = false;
      return;
    }
    this.cb(current as any, true);
  }
}

export class WatchNode<T> extends ComputationNode<never, T> {
  constructor(readonly source: ComputationNode<T>, readonly cb: WatchCB<T>) {
    super();
  }

  predecessors() {
    return [this.source];
  }

  next() {
    const data = this.source._data as T;
    if (data === null) return;
    this.cb(data as any, true);
  }
}
