<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>
import TailwindCss from './TailwindCss.svelte'
import SdkModal from './components/SdkModal.svelte'
import logo from './assets/game3js.png'

import { onMount } from 'svelte'

import { url } from './stores.js'

export function props() {
  return {
    url: $url
  }
}

onMount(async () => {
  var openmodal = document.querySelectorAll('.modal-open')
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener('click', function(event){
    	event.preventDefault()
    	toggleModal()
      })
    }
    
    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)
    
    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal)
    }
    
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ("key" in evt) {
    	isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else {
    	isEscape = (evt.keyCode === 27)
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
    	toggleModal()
      }
    };
        
    function toggleModal () {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.toggle('opacity-0')
      modal.classList.toggle('pointer-events-none')
      body.classList.toggle('modal-active')
    }
});

</script>

<TailwindCss></TailwindCss>

<style>
  .modal {
    transition: opacity 0.25s ease;
  }
  body.modal-active {
    overflow-x: hidden;
    overflow-y: visible !important;
  }
</style>

<main>
  <button class="modal-open m-2 fixed bottom-0 left-0 inline-flex items-center justify-center w-12 h-12 mr-2 transition-colors duration-300 bg-indigo-700 rounded-full hover:bg-indigo-900">
    <img class="w-10 h-10 fill-current" alt="g3js logo" src={logo}>
  </button>

  <SdkModal/>

</main>
