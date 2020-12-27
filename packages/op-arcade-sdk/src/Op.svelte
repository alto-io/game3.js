<!--
<svelte:options tag="op-arcade-sdk" />
-->

<script>
import TailwindCss from './TailwindCss.svelte'
import logo from './assets/game3js.png'

import { onMount } from 'svelte'

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

  <!--Modal-->
  <div class="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
    
    <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
      
      <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
        <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-left px-6">
        <!--Title-->
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">Simple Modal!</p>
          <div class="modal-close cursor-pointer z-50">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>
        </div>

        <!--Body-->
        <p>Modal content can go here</p>
        <p>...</p>
        <p>...</p>
        <p>...</p>
        <p>...</p>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button class="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">Action</button>
          <button class="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
        </div>
        
      </div>
    </div>
  </div>  
</main>
