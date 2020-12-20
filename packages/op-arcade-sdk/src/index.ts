
// import { Console } from './console'

// export {
//     Console
//     ExampleMainMenuScene
// };
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

(window as any).app = app;

export default app;