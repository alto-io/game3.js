<script>
import { onMount } from "svelte";


  export const SERVER_TYPES = {
    NAKAMA: "nakama"
  }

  export const SDK_STATES = {
    READY: "ready",
    INITIALIZED: "initialized"
  }

  export const LOGIN_STATES = {
    LOGGED_IN: "logged in",
    LOGGED_OUT: "logged out"
  }

  export let sdkState = SDK_STATES.READY;

  export let options;

  export function getSdkState() {
    return sdkState
  }

  export function connect() {
    return LOGIN_STATES.LOGGED_IN;
  }

  onMount(() => {
    console.log(options);
    sdkState = SDK_STATES.INITIALIZED;
  });
  
</script>