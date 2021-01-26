<script>
  import { Router, Route } from 'svelte-routing';
  import Experiments from './pages/experiments.svelte';
  import Editor from './pages/editor.svelte';
  import Landing from './pages/landing.svelte';
  import DedicatedView from './pages/dedicated_view.svelte';

  let url = '';
</script>

<Router {url}>
  <Route path="/">
    <Landing />
  </Route>

  <Route path="/dedicated-window/:cid" let:params>
    <DedicatedView channelId={params.cid} />
  </Route>

  <Route path="/app/*">
    <div class="flex flex-row h-screen bg-primary-700 text-fg-primary">
      <div class="flex-none flex flex-col w-16 p-4 bg-primary-700 justify-between items-center">
        <div class="flex flex-col space-y-4">
          <div>
            <div class="rounded-full bg-red-200 w-8 h-8" />
          </div>
          <div>
            <div class="rounded-full bg-red-200 w-8 h-8" />
          </div>
        </div>
        <div class="flex flex-col space-y-4">
          <div class="rounded-full bg-red-200 w-8 h-8" />
          <div class="rounded-full bg-red-200 w-8 h-8" />
          <div class="rounded-full bg-red-200 w-8 h-8" />
        </div>
      </div>
      <div class="flex-auto bg-primary-800 rounded-tl-lg shadow-2xl">
        <Router>
          <Route path="/experiments">
            <Experiments />
          </Route>
          <Route path="/editor/:eid" let:params>
            <Editor eid={params.eid} />
          </Route>
        </Router>
      </div>
    </div>
  </Route>
</Router>
