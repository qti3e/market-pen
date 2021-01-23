<script>
  import { Link } from 'svelte-routing';
</script>

<section class="w-full px-6 antialiased bg-primary-900 text-fg-primary select-none h-screen">
  <div class="mx-auto max-w-7xl">
    <nav class="relative z-50 h-24">
      <div
        class="container relative flex flex-wrap items-center justify-between h-24 mx-auto font-medium border-b border-gray-200 sm:px-4 md:px-2"
      >
        <a href="#_" class="w-1/4 py-4 pr-4 md:py-0">
          <span class="text-xl font-black leading-none select-none logo">
            MarketLab<span class="text-secondary-900">!</span><span
              class="bg-blue-600 p-1 rounded-lg relative bottom-4"
              style="font-size: 0.25rem;">BETA</span
            >
          </span>
        </a>

        <div />
      </div>
    </nav>

    <div class="container max-w-lg px-4 py-32 mx-auto text-left md:max-w-none md:text-center">
      <h1
        class="text-5xl font-extrabold tracking-tight text-left leading-tightest md:leading-10 md:text-center sm:leading-none md:text-6xl lg:text-7xl"
      >
        <span class="inline md:block">Never <span class="text-red-600">MISS</span></span>
        <span class="relative mt-2 text-transparent md:inline-block bg-clip-text"
          >on any trade.</span
        >
      </h1>
      <div class="mx-auto mt-5 text-gray-300 md:mt-12 md:max-w-lg md:text-center lg:text-lg">
        Create advanced technical indicators that works for you.
      </div>
      <div class="flex flex-col items-center mt-12 text-center">
        <Link
          to="/app/experiment/xxx"
          class="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-secondary-600 rounded-md sm:mb-0 hover:bg-secondary-700 sm:w-auto"
        >
          Try It Free
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 ml-1 feather feather-arrow-right"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg
          >
        </Link>
        <a href="#" class="mt-3 text-sm text-teal-500">Learn More</a>
      </div>
    </div>
  </div>
</section>
