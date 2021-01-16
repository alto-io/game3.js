<script>
    import CONSTANTS from '../constants.js';

    import { username, password, loginState, authStore } from '../stores.js';
    import { url, apiKey, opSdk, SDK_STATES } from '../stores.js';

    import { fade, fly } from 'svelte/transition'
    
import logo from '../assets/game3js.png'

let visible = false;

function handleKeydown(event) {
    let keyCode = event.keyCode;
    
    if (keyCode == 192) // for ~ key
      visible = !visible;
}

</script>

<svelte:window on:keydown={handleKeydown}/>

<button class="m-3 fixed top-0 left-0 inline-flex items-center justify-center w-12 h-12 mr-2 transition-colors duration-300 bg-indigo-700 rounded-full hover:bg-indigo-900"
on:click={() => visible = !visible}>
<img class="w-10 h-10 fill-current" alt="g3js logo" src={logo}>
</button>


{#if visible}
<div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div transition:fade={{duration: 100}} class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" on:click={() => visible = !visible}/>

    <aside
    transition:fly={{duration:400, x:-100}}
    class="transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out duration-300 z-30"
    >
    <span          
      class="flex w-full items-center p-4 border-b"
    >
      <img src={logo} alt="Logo" class="h-auto w-16 mx-auto" />
    </span>

    <span>
      <div class="flex items-center p-3 bg-blue-500 w-full">
        {#if $authStore.loginState == CONSTANTS.LOGIN_STATES.LOGGED_OUT}    
            <div>
              <input class="py-2 px-1 bg-white text-gray-700 placeholder-gray-500 shadow-md rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="username"
              bind:value={$username}>
            </div>
        {/if}
      </div>
    </span>

    <span>
      <div class="flex items-center p-3 bg-blue-500 w-full space-x-2">
        {#if $authStore.loginState == CONSTANTS.LOGIN_STATES.LOGGED_OUT}    
            <div>
              <input class="py-2 px-1 bg-white text-gray-700 placeholder-gray-500 shadow-md rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="password" type="password"
            bind:value={$password}>
          </div>
            <button class="bg-purple-600 text-white text-base font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                on:click={$authStore.login({username: $username, password: $password})}
                on:click={() => visible = !visible}
                >
                <span >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      class="w-6 h-6"
                    >
                    <path fill="none" d="M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z">
                      
                    </path>
                    </svg>
                  </span>
            </button>          
        {/if}
        {#if $authStore.loginState == CONSTANTS.LOGIN_STATES.LOGGED_IN}    
        <span
        class="flex items-center p-4 text-white"
        ><span class="mr-2">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            class="w-6 h-6"
          >
            <path
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </span>
        <span>{$username}</span></span
      >        
            <button class="bg-purple-600 text-white text-base font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                on:click={$authStore.logout()}
                on:click={() => visible = !visible}
                >
                <span >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      class="w-6 h-6"
                    >
                    <path fill="none" d="M8.416,3.943l1.12-1.12v9.031c0,0.257,0.208,0.464,0.464,0.464c0.256,0,0.464-0.207,0.464-0.464V2.823l1.12,1.12c0.182,0.182,0.476,0.182,0.656,0c0.182-0.181,0.182-0.475,0-0.656l-1.744-1.745c-0.018-0.081-0.048-0.16-0.112-0.224C10.279,1.214,10.137,1.177,10,1.194c-0.137-0.017-0.279,0.02-0.384,0.125C9.551,1.384,9.518,1.465,9.499,1.548L7.76,3.288c-0.182,0.181-0.182,0.475,0,0.656C7.941,4.125,8.234,4.125,8.416,3.943z M15.569,6.286h-2.32v0.928h2.32c0.512,0,0.928,0.416,0.928,0.928v8.817c0,0.513-0.416,0.929-0.928,0.929H4.432c-0.513,0-0.928-0.416-0.928-0.929V8.142c0-0.513,0.416-0.928,0.928-0.928h2.32V6.286h-2.32c-1.025,0-1.856,0.831-1.856,1.856v8.817c0,1.025,0.832,1.856,1.856,1.856h11.138c1.024,0,1.855-0.831,1.855-1.856V8.142C17.425,7.117,16.594,6.286,15.569,6.286z">
                      
                    </path>
                    </svg>
                  </span>
            </button>          
        {/if}


      </div>
    </span>
   
    <span
      class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
      ><span class="mr-2">
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
      </span>
      <span>Home</span>
    </span>

    <span
      class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
      ><span class="mr-2">
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </span>
      <span>Trending Globally</span></span
    >
    <span
      class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
      ><span class="mr-2">
        <svg
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
        </svg>
      </span>
      <span>Wishlist</span></span
    >
    <span
      class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
      ><span class="mr-2">
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </span>
      <span>About</span></span
    >
    <span
      class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
      ><span class="mr-2">
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      </span>
      <span>Contact</span></span
    >

    <div class="fixed bottom-0 w-full">

        <span
        class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
        ><span class="mr-2">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            class="w-6 h-6"
          >
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </span>
        <span>{$url}</span></span
      >
        

      <div class="flex items-center p-4 bg-blue-500 w-full">
        {#if $opSdk.state == SDK_STATES.NOT_CONNECTED}    
            <input class="mr-2 py-2 px-1 bg-white text-gray-700 placeholder-gray-500 shadow-md rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="tourney-id (xxxx-xxxx-..)"
            bind:value={$apiKey}>
            <button class="bg-purple-600 text-white text-base font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                on:click={opSdk.connect}>
                <span >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      class="w-6 h-6"
                    >
                      <path
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </span>
            </button>
        {/if}
      </div>
    </div>
  </aside>

</div>
{/if}