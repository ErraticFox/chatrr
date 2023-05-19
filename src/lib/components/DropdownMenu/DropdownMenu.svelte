<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import More from "svelte-material-icons/DotsVertical.svelte";
    import { fade } from "svelte/transition";

    let buttonRef = null;
    let menuRef = null;
    let open: boolean = false;

    function toggle() {
        open = !open;
    }
</script>

<svelte:window
    on:click={({ target }) => {
        if (buttonRef && buttonRef.contains(target)) return;
        if (menuRef && !menuRef.contains(target)) {
            open = false;
        }
    }}
/>

<div class="dropDown">
    <button class="icon" on:click={() => (open = !open)} bind:this={buttonRef}>
        <More size="20" />
    </button>
    {#if open}
        <div class="dropDownMenu" transition:fade={{ duration: 200 }} on:click={toggle} on:keydown={toggle}>
            <ul bind:this={menuRef}>
                <slot class="menuItem" />
            </ul>
        </div>
    {/if}
</div>

<style lang="scss">
    .dropDown {
        position: relative;
        z-index: 1;

        .dropDownMenu {
            box-shadow: 0px 0px 5px 1px #00000050;
            position: absolute;
            min-width: 75px;
            right: 15px;
            direction: rtl;
        }

        ul {
            margin-block-start: 0;
            margin-block-end: 0;
            padding-inline-start: 0;
        }

        div :global(.menuItem) {
            direction: ltr;
            padding: 15px;
            font-size: 14px;
            white-space: nowrap;

            &:hover {
                background-color: #eeeeee;
                cursor: pointer;
            }
        }
    }
</style>
