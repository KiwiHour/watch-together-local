import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { websocketServer } from './src/lib/websocket-server';

export default defineConfig({
	plugins: [sveltekit(), websocketServer]
});
