<script lang="ts">
    import Search from "svelte-material-icons/Magnify.svelte";
    import Stop from "svelte-material-icons/Close.svelte";
    import Send from "svelte-material-icons/Send.svelte";
    import Close from "svelte-material-icons/Close.svelte";
    import { roomStore, userChatStatusStore, userProfileStore } from "$lib/client/stores";
    import { page } from "$app/stores";
    import { sendMessage, setUserChatStatus } from "$lib/client/chatrr-firebase";
    import { Message } from "$lib/models/Message";
    import type { Room, UserChatStatus, UserProfile } from "$lib/models/types";

    let userProfile: UserProfile;
    let userChatStatus: UserChatStatus;
    let room: Room | null;
    $: userProfile = $userProfileStore || $page.data.userProfile;
    $: userChatStatus = $userChatStatusStore || $page.data.userChatStatus;
    $: room = $roomStore;

    let composeInput: HTMLInputElement;

    function composeNewMessage(event?: KeyboardEvent) {
        if (!event || event.key === "Enter" && composeInput.value.length) {
            const message = new Message();
            message.uid = userProfile.uid;
            message._roomId = room?._id;
            message.username = userProfile.username;
            message.message = composeInput.value;
            composeInput.value = "";
            sendMessage(message);
        }
    }
</script>

<div id="compose">
    {#if userChatStatus?.status === "searching"}
        <button class="icon searching" on:click={() => setUserChatStatus("disconnected")}>
            <Stop size="20" />
        </button>
    {:else if userChatStatus?.status === "disconnected"}
        <button class="icon search" on:click={() => setUserChatStatus("searching")}>
            <Search size="20" />
        </button>
    {:else if userChatStatus?.status === "connected"}
        <button class="icon connected" on:click={() => setUserChatStatus("disconnected")}>
            <Close size="20" />
        </button>
    {:else}
        <button class="icon search" disabled={!userChatStatus}>
            <Search size="20" />
        </button>
    {/if}
    <input
        bind:this={composeInput}
        type="text"
        placeholder="Connect to chat"
        disabled={userChatStatus?.status !== "connected"}
        on:keydown={(e) => composeNewMessage(e)}
    />
    <button class="icon send" disabled={userChatStatus?.status !== "connected"} on:click={() => composeNewMessage()}>
        <Send size="20" />
    </button>
</div>

<style lang="scss">
    #compose {
        display: flex;
        align-items: center;

        input {
            border: none;
            padding: 1rem 1rem;
            transition: 250ms;
            flex: 1;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            background-color: #eee;

            &:focus {
                outline: none;
                background-color: #f5f5f5;
            }
        }

        .icon {
            padding: 1rem;
        }
    }
</style>
