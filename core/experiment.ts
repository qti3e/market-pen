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

import { escape } from 'he';
import { RPC, WindowRPC, RpcHandlers } from './rpc';
import { randomString } from './util';
import { View } from './compiler/view';

function createIframe(rpcChannelId: string): HTMLIFrameElement {
  const base = new URL('/sandbox', window.document.baseURI).href;
  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="rpc-channel-id" content="${escape(rpcChannelId)}"/>
        <base href="${escape(base)}">
        <script async type="text/javascript" src="/sandbox/sandbox.js">
        </script>
      </head>
      <body>
      </body>
    </html>`;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.setAttribute('srcdoc', `${html}`);
  // Edge doesn't support "srcdoc", it'll use a data url instead.
  iframe.setAttribute('src', `data:text/html,${html}`);
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  return iframe;
}

export type ChartData = [open: number, high: number, low: number, close: number, volume: number][];

export interface ExecResult {
  /**
   * Each member in the array is an axis of the data.
   * ```
   * [
   *  open: number[],
   *  high: number[],
   *  low: number[],
   *  close: number[],
   *  volume: number[],
   *  ...
   * ]
   * ```
   */
  series: number[][];
}

export class Experiment {
  private iframe: HTMLIFrameElement;
  private RPC: RPC;
  readonly id: string;
  private _layout?: View;
  private data?: ChartData;
  private source?: string;

  constructor(private rpcHandler: RpcHandlers) {
    this.id = randomString();
  }

  private init() {
    if (this.RPC) return;
    this.iframe = createIframe(this.id);
    this.RPC = new WindowRPC(this.iframe.contentWindow, this.id);
    this.RPC.start(this.rpcHandler);
  }

  get layout(): View | undefined {
    return this._layout;
  }

  async setData(data: ChartData) {
    this.init();
    this.data = data;
    this.RPC.call('setData', data);
  }

  /**
   * Set the source code for the current program.
   * @param sourceCode A JavaScript document.
   */
  async setSourceCode(sourceCode: string) {
    if (sourceCode === this.source) return;
    this.init();
    this._layout = await this.RPC.call('compileProgram', sourceCode);
    this.source = sourceCode;
  }

  execute(): Promise<ExecResult> {
    this.init();
    if (!this.data || !this.source)
      throw new Error('You must first provide source code and the data.');
    return this.RPC.call('execute');
  }

  destroy() {
    if (!this.RPC) return;
    this.RPC.stop();
    if (this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.RPC = null;
    this.iframe = null;
  }
}

function createRPCHandler() {}
