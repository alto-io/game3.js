<script>
    import { getContext } from 'svelte';      
    import LoginPrompt from './LoginPrompt.svelte';
  
    const { open } = getContext('simple-modal');
  
    export const showPopup = () => {
          open(LoginPrompt);
    }
  </script>