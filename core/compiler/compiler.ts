import { ComputationNode, WatchNode, WatchCB, WatchChangeNode } from '../api/nodes';
import { Candle, Primitive } from '../api/operation';
import { toposort, global, globalEval } from '../util';
import type { Layout } from './layout';
import { Program } from './program';
import type { DataPoint } from '../indicators/interface';
import { Transpiler } from './transpiler';

export class Compiler {
  private readonly nodes = new Set<ComputationNode<never>>();
  private readonly series = new Map<any, number>();
  private readonly layout: Layout = [];

  /**
   * Generate a set of document specific global variables.
   */
  getContext(): Record<string, any> {
    const compiler = this;

    function $(arg: number | ((data: DataPoint, isFinal: boolean) => void)) {
      if (typeof arg === 'function') return void compiler.pin(new WatchNode($ as any, arg));
      return new Primitive(Number(arg));
    }
    $.__proto__ = Candle.prototype;
    Object.assign($, new Candle());

    function watch<T>(node: ComputationNode<T>, cb: WatchCB<T>, skipFirst: boolean = false): void {
      compiler.pin(new WatchChangeNode(node, cb, skipFirst));
    }

    watch.always = function watch<T>(node: ComputationNode<T>, cb: WatchCB<T>): void {
      compiler.pin(new WatchNode(node, cb));
    };

    function pin(node: ComputationNode<never>) {
      compiler.pin(node);
      return node;
    }

    return {
      $,
      watch,
      pin,
    };
  }

  /**
   * Add a new data series to be plotted the index in the `series` array is returned.
   * @param series
   */
  addSeries(series: any): number {
    let idx = this.series.get(series);
    if (idx !== undefined) return idx;
    idx = this.series.size;
    this.series.set(series, idx);
    return idx;
  }

  /**
   * Pin a computation node, so we can include the node in the execution plan.
   * Note: This node must be final, which means it is not allowed to have
   * any further successors.
   *
   * @param op The node to pin.
   */
  pin(node: ComputationNode<never>) {
    this.nodes.add(node);
  }

  /**
   * Return the execution order of all of the nodes in this program.
   */
  compileExecutionPlan(): ReadonlyArray<ComputationNode> {
    // Edges that form the computation graph.
    const edges: ([ComputationNode, ComputationNode] | [ComputationNode])[] = [];
    const visited = new Set();
    const nodes = Array.from(this.nodes);
    const queue: ComputationNode[] = nodes.slice(0);
    for (let i = 0; i < queue.length; ++i) {
      const isTopLevel = i < nodes.length;
      const node = queue[i];
      if (visited.has(node)) continue;
      visited.add(node);
      const predecessors = node.predecessors();
      queue.push(...predecessors);
      predecessors.forEach((u) => {
        // Top-level nodes must be final, they cannot be part of another computation chain.
        // e.g: watch, plot.
        if (this.nodes.has(u as any))
          throw new Error('Broken State: Top-level nodes are not supposed to have successors.');
        // Don't insert the direct dependencies of top-level nodes, we want to put them all
        // together at the end of the plan.
        edges.push(isTopLevel ? [u] : [u, node]);
      });
    }
    queue.length = 0;
    // Compute the execution order of nodes.
    const sorted = toposort(edges);
    if (!sorted) throw new Error('Found unexpected cycle in the computation graph.');
    sorted.push(...nodes);
    return sorted;
  }

  /**
   * Generate the program that we can start using!
   */
  compile(): Program {
    const plan = this.compileExecutionPlan();
    return new Program(this.layout, plan);
  }
}

let transpiler: Transpiler;

/**
 * Compile a JavaScript source code, into a `Program`.
 * @param code The source code of the program.
 */
export async function compile(code: string): Promise<Program> {
  const compiler = new Compiler();
  const ctx = compiler.getContext();

  const keys = Object.keys(ctx);
  const values = Object.values(ctx);

  if (!transpiler) transpiler = new Transpiler(keys);

  const transpiledSource = transpiler.transpile(code, 'block');
  await globalEval(transpiledSource)(global, importModule, ...values);

  return compiler.compile();
}

export function formatException(e: any) {
  if (!transpiler) return new Transpiler([]).formatException(e);
  return transpiler.formatException(e);
}

/**
 * Handle module imports, currently not supported my market-watch.
 * @param target Name of the module.
 */
async function importModule(target: string) {
  // Check whether module is a built-in.
  // switch (target) {
  //   case "matplotlib": return matplotlib;
  //   case "test_internals": return test_internals;
  // }
  throw new TypeError(`Invalid module name: '${target}'`);
}
