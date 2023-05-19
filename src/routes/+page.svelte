<script lang="ts">
    import { roomStore } from "$lib/client/stores";
    import Compose from "$lib/components/compose/Compose.svelte";
    import Messages from "$lib/components/messages/Messages.svelte";
    import PeerPreview from "$lib/components/peerPreview/PeerPreview.svelte";
</script>

<svelte:head>
    <title>Chatrr</title>
    <meta name="description" content="Chatrr App" />
</svelte:head>

<section>
    <div id="chat">
        <PeerPreview />
        <Messages />
        <Compose />
    </div>
</section>

<style>
    #chat {
        display: flex;
        flex-direction: column;
        position: fixed;
        height: calc(100% - 68px);
        box-sizing: border-box;
        width: 100%;
        max-width: 64rem;
    }
</style>
