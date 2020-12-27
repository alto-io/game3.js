import { readable, writable } from 'svelte/store';

export const url = readable(window.location.href);