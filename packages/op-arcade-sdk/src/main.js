import Op from './Op.svelte';

let config = null

try {
	let configString = document.getElementsByName('op-config')[0];

	if (configString != undefined)
		config = JSON.parse(configString.content);

} catch (e)
{
	console.log("unable to process op-config -- check if valid json")
}

const op = new Op({
	target: document.body,
	props: {
		config
	}
});

// attach to window
window.op = op;

export default op;