<svelte:options tag="op-arcade-sdk" />

<script>
import TailwindCss from './TailwindCss.svelte'

export let name;
</script>
<TailwindCss></TailwindCss>


<main>
  <h1 class="bg-green-500">Hello {name} from op-arcade-sdk!</h1>
</main>
