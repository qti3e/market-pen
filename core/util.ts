/*!
   Copyright 2018 Propel http://propel.site/.  All rights reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

// If you use the eval function indirectly, by invoking it via a reference
// other than eval, as of ECMAScript 5 it works in the global scope rather than
// the local scope. This means, for instance, that function declarations create
// global functions, and that the code being evaluated doesn't have access to
// local variables within the scope where it's being called.
export const globalEval = eval;

// A reference to the global object.
export const global = globalEval('this');

// A `Resolvable` is a Promise with the `reject` and `resolve` functions
// placed as methods on the promise object itself. It allows you to do:
//
//   const p = createResolvable<number>();
//   ...
//   p.resolve(42);
//
// It'd be prettier to make Resolvable a class that inherits from Promise,
// rather than an interface. This is possible in ES2016, however typescript
// produces broken code when targeting ES5 code.
// See https://github.com/Microsoft/TypeScript/issues/15202
// At the time of writing, the github issue is closed but the problem remains.
export interface Resolvable<T> extends Promise<T> {
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export function createResolvable<T>(): Resolvable<T> {
  let methods;
  const promise = new Promise<T>((resolve, reject) => {
    methods = { resolve, reject };
  });
  return Object.assign(promise, methods) as Resolvable<T>;
}

export function randomString(): string {
  // 10 characters are returned:
  //   2log(36^10)                 ~= 51.7 bits
  //   mantisssa of IEEE754 double == 52 bits
  return (Math.random() + 1).toString(36).padEnd(12, '0').slice(2, 12);
}

export function assert(expr: boolean, msg = '') {
  if (!expr) {
    throw new Error(msg);
  }
}

export function equal(c: any, d: any): boolean {
  const seen = new Map();
  return (function compare(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) {
      return true;
    }
    if (a && typeof a === 'object' && b && typeof b === 'object') {
      if (seen.get(a) === b) {
        return true;
      }
      if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
      }
      for (const key in { ...a, ...b }) {
        if (!compare(a[key], b[key])) {
          return false;
        }
      }
      seen.set(a, b);
      return true;
    }
    return false;
  })(c, d);
}

export function assertEqual(actual: any, expected: any, msg = null) {
  if (!msg) {
    msg = `actual: ${actual} expected: ${expected}`;
  }
  if (!equal(actual, expected)) {
    console.error('assertEqual failed. actual = ', actual, 'expected =', expected);
    throw new Error(msg);
  }
}

/**
 * Return the topological order of the nodes in the given graph, or `null` in
 * case there was a cycle and we were unable to perform the operation.
 *
 * @param edges The edges of the graph.
 */
export function toposort<T>(edges: ([T, T] | [T])[]): T[] | null {
  const vertices = new Map<T, { inDegree: number; successors: Set<T> }>();
  const queue: T[] = [];
  const result: T[] = [];

  for (let i = 0, n = edges.length, e = edges[0]; i < n; e = edges[++i]) {
    if (!vertices.has(e[0])) vertices.set(e[0], { inDegree: 0, successors: new Set() });
    if (e.length < 2) continue;
    if (!vertices.has(e[1])) vertices.set(e[1], { inDegree: 0, successors: new Set() });
    vertices.get(e[0])!.successors.add(e[1]);
  }

  for (const entry of vertices.values())
    for (const v of entry.successors) vertices.get(v)!.inDegree += 1;

  for (const [node, entry] of vertices) if (entry.inDegree === 0) queue.push(node);

  for (let i = 0; i < queue.length; ++i) {
    const u = queue[i];
    result.push(u);
    for (const v of vertices.get(u)!.successors) {
      const ev = vertices.get(v)!;
      if (--ev.inDegree === 0) queue.push(v);
    }
  }

  if (result.length !== vertices.size) return null;

  return result;
}
