<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>
import CONSTANTS from './constants.js'

import TailwindCss from './TailwindCss.svelte'
import SdkDrawer from './components/SdkDrawer.svelte'

import { config, tourneyStore, authStore, url } from './stores.js'

 function props() {
  return {
    url: $url,
    config: $config
  }
}

async function getTourney(options) {

  let result = await $tourneyStore.getTourney(options);
  return result;
  
}

async function loginPrompt() {

return "Hello!";

}



export {
  CONSTANTS,
  props,
  getTourney,
  loginPrompt
}

</script>

<TailwindCss></TailwindCss>
<SdkDrawer/>