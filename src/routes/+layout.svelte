<script lang="ts">
    import { browser } from "$app/environment";
    import { initializeFirebase } from "$lib/client/firebase";
    import { PUBLIC_FIREBASE_CLIENT_CONFIG } from "$env/static/public";
    import "../global.scss";
    import { initializeUserPresence, listenForRoom, listenToUserChatStatus } from "$lib/client/chatrr-firebase";
    import { navigating, page } from "$app/stores";
    import { initializedListeners, loading } from "$lib/client/stores";
    import Header from "./Header.svelte";
    import { Shadow } from "svelte-loading-spinners";

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
            listenForRoom($page.data.userSession.uid);
        }
    }
</script>

<div class="app">
    {#if $navigating || $loading}
        <div class="loading_wrapper">
            <Shadow />
        </div>
    {/if}
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

    .loading_wrapper {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        bottom: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
        flex: 1;
    }

    /* @media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
