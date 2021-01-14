<section class="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
  <header class="flex items-center justify-between">
    <h2 class="text-lg leading-6 font-medium text-black">Projects</h2>
    <button
      class="hover:bg-blue-200 hover:text-blue-800 group flex items-center rounded-md bg-blue-100 text-blue-600 text-sm font-medium px-4 py-2">
      <svg
        class="group-hover:text-blue-600 text-blue-500 mr-2"
        width="12"
        height="20"
        fill="currentColor">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"
        />
      </svg>
      New
    </button>
  </header>
  <form class="relative">
    <svg
      width="20"
      height="20"
      fill="currentColor"
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      />
    </svg>
    <input
      class="focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10"
      type="text"
      aria-label="Filter projects"
      placeholder="Filter projects"
    />
  </form>
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
    <li class="hover:shadow-lg flex rounded-lg">
      <a
        href="/new"
        class="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
        New Project
      </a>
    </li>
  </ul>
</section>
