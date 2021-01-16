import { Transpiler } from './transpiler';
import { RPC, WindowRPC } from './rpc';
import { global, globalEval } from './util';

const transpiler = new Transpiler();

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

const channelId = document.querySelector('meta[name=rpc-channel-id]').getAttribute('content');

const rpc: RPC = new WindowRPC(window.parent, channelId);

rpc.start({
  execute,
});

async function execute(source: string): Promise<void> {
  try {
    const transpiledSource = transpiler.transpile(source, `code`);
    const fn = globalEval(transpiledSource);
    const result = await fn(global, importModule, console);
    if (result !== undefined) {
      console.log(result);
    }
  } catch (e) {
    const message = transpiler.formatException(e);
    rpc.call('print', message);
    // When running tests, rethrow any errors. This ensures that errors
    // occurring during notebook cell evaluation result in test failure.
    if (window.navigator.webdriver) {
      throw e;
    }
  }
}

window.addEventListener('error', (ev: ErrorEvent) => {
  let message: string;
  if (ev.error != null) {
    message = transpiler.formatException(ev.error);
  } else {
    message = ev.message;
  }
  rpc.call('error', message);
});
