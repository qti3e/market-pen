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
  let editor: MonacoEditor.IStandaloneCodeEditor;
  let destroyed = false;

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
    editor = monaco.editor.create(container, {
      value: jsCode,
      language: 'javascript',
    });
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
      }
    };
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/monaco/monaco-style.css" />
</svelte:head>

<div class="monaco-container" bind:this={container} style="height: 500px; text-align: left" />
