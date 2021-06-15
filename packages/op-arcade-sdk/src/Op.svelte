<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>

// origin expects no trailing slash
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://test.outplay.games',
  'http://alpha.outplay.games',
  'http://op-arcade-dev.herokuapp.com',
  'http://op-arcade-alpha.herokuapp.com',
  'http://op-arcade-prod.herokuapp.com',
]

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
    },
}

export let config;
export const configStore = writable(config);

import CONSTANTS from './constants.js'
import { writable, get } from 'svelte/store'
import * as remotePlay from './remotePlay'

// import TailwindCss from './TailwindCss.svelte'
// import SdkDrawer from './components/SdkDrawer.svelte'
// import Content from './components/Content.svelte';
// import Modal from './components/Modal.svelte';

import { tourneyStore, 
        loginState, 
        authStore, 
        url, 
        onOpArcade,
        apiUrl,
        isTournament,
        passedSessionToken, 
        tournamentId,
        useServers,
      } from './stores.js'

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
  onOpArcade.set(ALLOWED_ORIGINS.includes($url.slice(0, -1)));

  console.log('%c%s',
      'color: orange; background: white;',
      "-- Welcome to OP Arcade --"
      )

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
  if (ALLOWED_ORIGINS.includes(e.origin)) {
    try {
      let messageData = JSON.parse(e.data);
      apiUrl.set(messageData.apiUrl);
      passedSessionToken.set(messageData);
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
  window.top.postMessage('postScore', '*')
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
  initialize,
  remotePlay,
}

// disable frontend 

// <TailwindCss></TailwindCss>
// <SdkDrawer/>

// <Modal>
// 	<Content bind:showPopup={showPopup}/>
// </Modal>

</script>


