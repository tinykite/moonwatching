import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
  kit: {
	adapter: adapter({
		      // Cloudflare Pages configuration
			  routes: {
				include: ['/*'],
				exclude: ['<all>']
			  }
  	}),
    alias: {
      $components: 'src/components',
      $utils: 'src/utils',
      $consts: 'src/constants'
    }
  }
};

export default config;


