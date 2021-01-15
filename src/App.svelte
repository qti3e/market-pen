<script>
  import { Router, Route } from 'svelte-routing';
  import Experiments from './pages/experiments.svelte';
  import View from './pages/view.svelte';
  let url = '';
</script>

<div class="flex flex-row h-screen bg-primary-700">
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
  <div class="flex-auto bg-primary-100 rounded-tl-lg shadow-2xl">
    <Router {url}>
      <Route path="/experiments">
        <Experiments />
      </Route>
      <Route path="/experiment/:id">
        <View />
      </Route>
    </Router>
  </div>
</div>
