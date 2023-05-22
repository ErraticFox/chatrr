<script>
    import Light from "svelte-material-icons/WhiteBalanceSunny.svelte";
    import Dark from "svelte-material-icons/WeatherNight.svelte";
    import { browser } from "$app/environment";
    
    let theme;

    if (browser) {
        if (localStorage.getItem("theme")) {
            theme = localStorage.getItem("theme")
        } else {
            localStorage.setItem("theme", "light");
            theme = localStorage.getItem("theme")
        }
    }

    function toggle() {
        if (localStorage.getItem("theme") === "light") {
            window.document.documentElement.classList.remove("light");
            window.document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            theme = localStorage.getItem("theme")
        } else {
            window.document.documentElement.classList.remove("dark");
            window.document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
            theme = localStorage.getItem("theme")
        }
    }
</script>

<button on:click={toggle}>
    {#if theme === "light"}
        <Light size="20" />
    {:else if theme === "dark"}
        <Dark size="20" />
    {/if}
</button>

<style lang="scss">
    :root {
        --bg-color: #ffffff;
        --text-color: #212121;
    }

    :global(html) {
        background: var(--bg-color);
        color: var(--text-color);
    }

    :global(html.dark) {
        --bg-color: #212121;
        --text-color: #fafafa;
    }
</style>
