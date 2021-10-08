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
  'http://dev.mightybiggames.com'

]

import * as remotePlay from './remotePlay'

window.addEventListener("message", (e) => {
  if (ALLOWED_ORIGINS.includes(e.origin)) {
    try {
      let messageData = JSON.parse(e.data);
      remotePlay.initSession(messageData.playServerUrl, messageData.playSessionId)
    } catch (e) {
      console.log(e)
    }
  }
}, false);

export {
  remotePlay,
}

</script>


