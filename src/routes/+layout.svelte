<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
	import { browser } from '$app/environment';
	import { initializeFirebase } from '$lib/client/firebase';
	import { PUBLIC_FIREBASE_CLIENT_CONFIG } from '$env/static/public';
	import '../global.scss';
	import { initializeUserPresence, listenToUserChatStatus } from '$lib/client/chatrr-firebase';
	import { page } from '$app/stores';
	import { initializedListeners } from '$lib/client/stores';
	import Header from './Header.svelte';

	if (browser) {
		try {
			initializeFirebase(JSON.parse(PUBLIC_FIREBASE_CLIENT_CONFIG));
		} catch (ex) {
			console.error(ex);
		}
	}

	$: if (browser) {
		if (!$initializedListeners && $page.data.userSession) {
			initializedListeners.set(true);
			initializeUserPresence();
			listenToUserChatStatus();
		}
	}
</script>

<div class="app">
	<main>
		<Header />
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	/* @media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
