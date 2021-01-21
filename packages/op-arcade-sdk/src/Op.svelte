<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>
import CONSTANTS from './constants.js'

import TailwindCss from './TailwindCss.svelte'
import SdkDrawer from './components/SdkDrawer.svelte'
import Content from './components/Content.svelte';
import Modal from './components/Modal.svelte';


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

let showPopup; // bound to content

async function loginPrompt() {
  showPopup();
}

async function attemptTourney(options) {
  let result = await $tourneyStore.attemptTourney(options);
  return result;
}

export {
  CONSTANTS,
  props,
  getTourney,
  loginPrompt,
  attemptTourney
}

</script>

<TailwindCss></TailwindCss>
<SdkDrawer/>

<Modal>
	<Content bind:showPopup={showPopup}/>
</Modal>