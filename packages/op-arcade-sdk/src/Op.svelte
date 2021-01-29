<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>

export const OP_ARCADE_URL = "http://localhost:3000/"

export const DEFAULT_CONFIG = {
    tourney_server: {
        type: CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA,
        url: "localhost",
        port: "7350",
        key: "defaultkey"
    },
    auth_server: {
        type: CONSTANTS.TOURNEY_SERVER_TYPES.NAKAMA,
        url: "localhost",
        port: "7350",
        key: "defaultkey"
    }
}

export let config;
export const configStore = writable(config);

import CONSTANTS from './constants.js'
import { writable, get } from 'svelte/store';

import TailwindCss from './TailwindCss.svelte'
import SdkDrawer from './components/SdkDrawer.svelte'
import Content from './components/Content.svelte';
import Modal from './components/Modal.svelte';

import { tourneyStore, authStore, url, onOpArcade, useServers, set } from './stores.js'

 function props() {
  return {
    url: $url,
    config
  }
}

async function initialize() {
  let serverConfig = get(configStore);

  if (serverConfig == null)
  {
    console.log('%c%s',
        'color: blue; background: white;',
        "-- Using default localhost config --"
        )
    serverConfig = DEFAULT_CONFIG;
  }

  // check if we're on OP Arcade
  onOpArcade.set($url === OP_ARCADE_URL);

  useServers(serverConfig);
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

async function postScore(options) {
  let result = await $tourneyStore.postScore(options);
  return result;
}

async function joinTourney(options) {
  let result = await $tourneyStore.joinTourney(options);
  return result;
}

function getSessionToken() {
  let session = $authStore.getSessionToken();
  return session;
}

async function urlGameDetails(options) {
  let result = await $tourneyStore.urlGameDetails(options);
  return result;
}

export {
  CONSTANTS,
  props,
  getTourney,
  loginPrompt,
  attemptTourney,
  postScore,
  joinTourney,
  getSessionToken,
  urlGameDetails,
  useServers,
  initialize
}

</script>

<TailwindCss></TailwindCss>
<SdkDrawer/>

<Modal>
	<Content bind:showPopup={showPopup}/>
</Modal>