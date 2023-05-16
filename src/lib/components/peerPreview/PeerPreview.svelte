<script>
    import { peerPresenceStore, peerProfileStore, roomStore } from "$lib/client/stores";
    import { fade, slide } from "svelte/transition";

    $: room = $roomStore;
    $: peerProfile = $peerProfileStore;
    $: peerPresence = $peerPresenceStore;
</script>

{#if room && peerProfile && peerPresence}
    <div id="peerPreview" in:slide={{ duration: 250 }} out:slide={{ delay: 250, duration: 250 }}>
        <div class="innerPreview" in:fade={{ delay: 250 }} out:fade={{ duration: 250 }}>
            <div class="peerStatusWrapper">
                <div class="peerStatus {peerPresence.status}" />
                <div class="peerStatus peerFlash {peerPresence.status}" />
            </div>
            <div class="peerUsername">{peerProfile.username}</div>
        </div>
    </div>
{/if}

<style lang="scss">
    #peerPreview {
        height: 75px;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        padding: 0 1rem;
        display: flex;
        align-items: center;

        .innerPreview {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .peerStatusWrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;

            .peerStatus {
                width: 12px;
                height: 12px;
                border-radius: 100%;
                position: absolute;

                &.peerFlash {
                    animation: blink 1s infinite;
					z-index: -1;
                    &.online {
                        background-color: #AED581;
                    }

                    &.away {
                        background-color: #FBC02D;
                    }
                }

                &.online {
                    background-color: #81C784;
                }

                &.away {
                    background-color: #FFD54F;
                }
            }
        }
    }

    @keyframes blink {
        0% {
            opacity: .5;
        }
        100% {
            width: 25px;
            height: 25px;
            opacity: 0;
        }
    }
</style>
