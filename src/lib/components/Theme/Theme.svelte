<script>
    let darkMode = false;
    import Light from "svelte-material-icons/WhiteBalanceSunny.svelte";
    import Dark from "svelte-material-icons/WeatherNight.svelte";
    import { slide } from "svelte/transition";
    function toggle() {
        darkMode = !darkMode;
        window.document.body.classList.toggle("dark");
    }
</script>

<button on:click={toggle}>
    {#if darkMode}
        <Light size="20" />
    {:else}
        <Dark size="20" />
    {/if}
</button>

<style lang="scss">
    :root {
        --bg-color: #ffffff;
        --text-color: #212121;
    }

    :global(body) {
        background: var(--bg-color);
        color: var(--text-color);
    }

    :global(body.dark) {
        --bg-color: #212121;
        --text-color: #fafafa;
    }
</style>
