<script context="module" lang="ts">
  let monaco: typeof import('monaco-editor/esm/vs/editor/editor.api');
  const monaco_promise = import('/monaco/monaco.bundle.js' as any);
  monaco_promise.then((mod) => {
    monaco = mod.default;
    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
    });

    // extra libraries
    const libSource = [
      '    /**',
      '     * Just another class.',
      '     */',
      'declare class Facts {',
      '    /**',
      '     * Returns the next fact',
      '     */',
      '    static next():string',
      '}',
    ].join('\n');
    monaco.languages.typescript.javascriptDefaults.setExtraLibs([
      {
        content: libSource,
      },
    ]);
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

  var jsCode = [
    '"use strict";',
    '',
    'class Chuck {',
    '    greet() {',
    '        return Facts.next();',
    '    }',
    '}',
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
