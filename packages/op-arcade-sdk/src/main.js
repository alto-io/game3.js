import Op from './Op.svelte';

const op = new Op({
	target: document.body,
	props: {
		name: 'world'
	}
});

// attach to window
window.op = op;

export default op;