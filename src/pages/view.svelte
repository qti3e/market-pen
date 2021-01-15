<script lang="ts">
  import Editor from '../components/monaco/editor.svelte';

  let editor: Editor;
</script>

<div class="flex flex-col h-full">
  <div class="h-16 rounded-tl-lg bg-primary-800 flex flex-row justify-between p-4">
    <div>A</div>
    <div>B</div>
  </div>

  <div class="flex-auto w-full bg-red-200">
    <Editor bind:this={editor} />
  </div>
</div>
