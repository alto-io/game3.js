<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>
import TailwindCss from './TailwindCss.svelte'
import SdkDrawer from './components/SdkDrawer.svelte'

import { url } from './stores.js'

export function props() {
  return {
    url: $url
  }
}

export async function connect(tourney_id) {
  return tourney_id
}


</script>

<TailwindCss></TailwindCss>
<SdkDrawer/>