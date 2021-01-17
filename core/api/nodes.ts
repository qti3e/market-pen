import { DataPoint } from '../indicators/interface';

const NOT_SET = Symbol('NOT_SET');

export interface ExecutionContext {
  $: DataPoint;
}

export abstract class ComputationNode {
  /** @internal */
  _data: any = NOT_SET;

  /**
   * Return the list of nodes that this node is depended on.
   * @internal
   */
  abstract predecessors(): ComputationNode[];

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
  data() {
    if (this._data === NOT_SET) throw new Error(`You're not allowed to use the data yet.`);
    return this._data;
  }

  /** @internal */
  valueOf() {
    const err = 'Unexpected use of computation-node.';
    const hint = `Use '.data()' to obtain the latest value of the node.`;
    throw new Error(err + ' ' + hint);
  }
}

export class WatchChangeNode extends ComputationNode {
  private prev = NOT_SET;

  constructor(
    readonly source: ComputationNode,
    readonly cb: (value: any, isFinal: boolean) => void
  ) {
    super();
  }

  predecessors() {
    return [this.source];
  }

  next() {
    const prev = this.prev;
    const current = this.source._data;
    if (current === prev) return;
    this.prev = current;
    this.cb(current, true);
  }
}

export class WatchNode extends ComputationNode {
  constructor(
    readonly source: ComputationNode,
    readonly cb: (value: any, isFinal: boolean) => void
  ) {
    super();
  }

  predecessors() {
    return [this.source];
  }

  next() {
    this.cb(this.source._data, true);
  }
}
