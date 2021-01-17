import { ComputationNode } from './nodes';
import { toposort } from '../util';

export class Compiler {
  private readonly nodes = new Set<ComputationNode>();

  /**
   * Pin a computation node, so we include the node in the execution plan.
   * Note: This node must be final, which means it is not allowed to have
   * any further successors.
   *
   * @param op The node to pin.
   */
  pin(node: ComputationNode) {
    this.nodes.add(node);
  }

  /**
   * Return the execution order of all of the nodes in this program.
   */
  compileExecutionPlan(): ReadonlyArray<ComputationNode> {
    // Edges that form the computation graph.
    const edges: [ComputationNode, ComputationNode][] = [];
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
        if (this.nodes.has(u))
          throw new Error('Broken State: Top-level nodes are not supposed to have successors.');
        // Don't insert the direct dependencies of top-level nodes, we want to put them all
        // together at the end of the plan.
        if (!isTopLevel) edges.push([u, node]);
      });
    }
    queue.length = 0;
    // Compute the execution order of nodes.
    const sorted = toposort(edges);
    if (!sorted) throw new Error('Found unexpected cycle in the computation graph.');
    sorted.push(...nodes);
    return sorted;
  }
}
