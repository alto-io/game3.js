<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>
import TailwindCss from './TailwindCss.svelte'
import logo from './assets/game3js.png'
</script>
<TailwindCss></TailwindCss>


<main>
  <button class="m-2 fixed bottom-0 left-0 inline-flex items-center justify-center w-12 h-12 mr-2 transition-colors duration-150 bg-indigo-700 rounded-full focus:shadow-outline hover:bg-indigo-800">
    <img class="w-10 h-10 fill-current" alt="g3js logo" src={logo}>
  </button>
</main>
