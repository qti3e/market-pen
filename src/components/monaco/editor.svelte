<script context="module" lang="ts">
  let monaco: typeof import('monaco-editor/esm/vs/editor/editor.api');
  const monaco_promise = import('/monaco/monaco.bundle.js' as any);
  const lib_promise = fetch('/sandbox/lib.d.ts').then((x) => x.text());

  monaco_promise.then((mod) => {
    monaco = mod.default;

    // validation settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      lib: ['es2019'],
    });

    lib_promise.then((libSource) => {
      const libUri = 'ts:market-lab/lib.d.ts';
      monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
      monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
    });
  });
</script>

<script lang="ts">
  import type { editor as MonacoEditor } from 'monaco-editor/esm/vs/editor/editor.api';

  import { onMount } from 'svelte';
  let container: HTMLElement;
  let outer: HTMLElement;
  let editor: MonacoEditor.IStandaloneCodeEditor;
  let destroyed = false;
  let prevWidth: number = -1;
  let prevHeight: number = -1;

  /** Should the editor be read only. Defaults to false. */
  export let readOnly: boolean = false;

  /** The theme to be used for rendering. */
  export let theme: 'vs' | 'vs-dark' | 'hc-black' = 'vs-dark';

  let jsCode = [
    'const SMA30 = $.ta.simple_moving_average(30);',
    'const SMA20 = $.ta.simple_moving_average(20);',
    '',
    'plot("SMA20", SMA20);',
    'plot("SMA30", SMA30, undefined, "#f00");',
    'indicator("volume", $.volume);',
  ].join('\n');

  function init() {
    if (destroyed) return;
    editor = monaco.editor.create(
      container,
      {
        value: jsCode,
        language: 'javascript',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly,
        theme,
        dimension: {
          width: (prevWidth = outer.clientWidth),
          height: (prevHeight = outer.clientHeight),
        },
      },
      {
        storageService: {
          get() {},
          getBoolean(key: string) {
            if (key === 'expandSuggestionDocs') return true;
            return false;
          },
          store() {},
          onWillSaveState() {},
          onDidChangeStorage() {},
        },
      }
    );

    // The first one is set to 700ms to prevent a screen flush, and the second one
    // is there just to be safe.
    setTimeout(resize, 700);
    setTimeout(resize, 1500);
  }

  onMount(() => {
    if (monaco) {
      init();
    } else {
      monaco_promise.then(() => init());
    }

    return () => {
      destroyed = true;
      if (editor) {
        editor.dispose();
        editor = undefined;
      }
    };
  });

  /**
   * Call this function when the size of the container of this editor has changed.
   */
  export function resize() {
    if (!editor) return;
    const width = outer.clientWidth;
    const height = outer.clientHeight;
    if (width === prevWidth && height === prevHeight) return;
    prevWidth = width;
    prevHeight = height;
    editor.layout({ width, height });
  }

  export function getValue() {
    return editor.getValue();
  }

  $: {
    if (editor) {
      editor.updateOptions({
        readOnly,
        theme,
      });
    }
  }
</script>

<svelte:window on:resize={resize} />

<svelte:head>
  <link rel="stylesheet" href="/monaco/monaco-style.css" />
</svelte:head>

<div bind:this={outer} style="position: relative; overflow: hidden; width: 100%; height: 100%;">
  <div bind:this={container} style="position: absolute;" />
</div>
