<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>

export const OP_ARCADE_URL_DEV = "http://localhost:3000/"
export const OP_ARCADE_URL_PROD = "http://test.outplay.games/"

// origin expects no trailing slash
export const OP_ARCADE_URL_DEV_ORIGIN = "http://localhost:3000"
export const OP_ARCADE_URL_PROD_ORIGIN = "http://test.outplay.games"

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

import { tourneyStore, 
        loginState, 
        authStore, 
        url, 
        onOpArcade, 
        isProd,
        isTournament,
        passedSessionToken, 
        tournamentId,
        useServers } from './stores.js'

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
  onOpArcade.set($url == OP_ARCADE_URL_DEV || $url == OP_ARCADE_URL_PROD);
  isProd.set($url == OP_ARCADE_URL_PROD);

  if (get(isProd))
  {
    console.log('%c%s',
        'color: orange; background: white;',
        "-- Welcome to OP Arcade --"
        )
  }
  else {
    console.log('%c%s',
        'color: orange; background: white;',
        "-- development mode --"
        )
  }

  useServers(serverConfig).then(
    (result) => {
      if ($onOpArcade)
      {
        updateOpArcadeStores();
      }
    }
  );
}

function updateOpArcadeStores() {

    // possible timing issue with useServers. need to find a way to sync
    if ($passedSessionToken === null) {
      console.log("no session token passed")
    }
    else {
      $loginState = saveSessionToken($passedSessionToken);
      $tournamentId = saveTournamentId($passedSessionToken);

      if ($tournamentId !== null) 
        $isTournament = true;
    }
}

// save session token
window.addEventListener("message", (e) => {
  if (e.origin == OP_ARCADE_URL_DEV_ORIGIN ||
      e.origin == OP_ARCADE_URL_PROD_ORIGIN)
    {
      try {
      let session = JSON.parse(e.data);
      passedSessionToken.set(session);
      updateOpArcadeStores();
    } catch (e) {
      console.log(e)
    }
      
    }
}, false);

function getSessionFromOpArcade()
{
  window.top.postMessage('getSession', '*')
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

function saveSessionToken(options) {
  return $authStore.saveSessionToken(options);
}

function saveTournamentId(options) {
  return $tourneyStore.saveTournamentId(options);
}

function getTournamentId() {
  let tournamentId = $tourneyStore.getTournamentId();
  return tournamentId;
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
  getTournamentId,
  useServers,
  initialize
}

</script>

<TailwindCss></TailwindCss>
<SdkDrawer/>

<Modal>
	<Content bind:showPopup={showPopup}/>
</Modal>