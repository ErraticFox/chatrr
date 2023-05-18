<script lang="ts">
    import { page } from "$app/stores";
    import { loadingChat, messagesStore, userChatStatusStore, userProfileStore } from "$lib/client/stores";
    import { msToDateString } from "$lib/utils";
    import { Circle2 } from "svelte-loading-spinners";

    $: userProfile = $userProfileStore || $page.data.userProfile;
    $: userChatStatus = $userChatStatusStore || $page.data.userChatStatus;

    function determineUser(uid: string) {
        return !uid ? "server" : uid === userChatStatus.uid ? "user" : "peer";
    }

    function parseServerMessage(message: string) {
        if (message.includes(userProfile.username)) {
            return message.replace(`${userProfile.username} has`, 'you have')
        }
        return message
    }
</script>

<div id="messages">
    {#if userChatStatus?.status === "searching" || (userChatStatus?.status === "connected" && !$messagesStore.length)}
        <div class="loading">
            <Circle2 durationMultiplier={0.5} />
        </div>
    {/if}

    {#each $messagesStore as message}
        <div class="message {determineUser(message?.uid)}">
            <div class="message_head">
                <div class="username">{message.username || "server"}</div>
                <div class="timestamp">{msToDateString(message.timestamp)}</div>
            </div>
            <div class="message_body">
                <p class="content">{!message.username ? parseServerMessage(message.message) : message.message}</p>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    #messages {
        flex: 1;
        margin: 0 1rem;
        display: flex;
        flex-direction: column-reverse;
        gap: 1rem;

        .message {
            margin: 0 3rem;

            .message_head {
                display: flex;
                gap: 0.5rem;
                align-items: center;

                .username {
                    font-weight: 600;
                    color: #9e9e9e;
                }

                .timestamp {
                    font-size: 10px;
                    color: #9e9e9e;
                }
            }

            .content {
                margin: 0.5rem 0;
            }

            &.user {
                .username {
                    color: #4caf50;
                }
            }

            &.peer {
                .username {
                    color: #ff5722;
                }
            }
        }

        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>
