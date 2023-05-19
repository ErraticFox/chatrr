<script lang="ts">
    import Theme from "$lib/components/Theme/Theme.svelte";
    import Auth from "$lib/components/auth/Auth.svelte";
</script>

<div id="header">
    <a id="header_name" href="/">chatrr</a>
    <Theme />
    <Auth />
</div>

<style lang="scss">
    #header {
        display: flex;
        align-items: center;
        padding: 1rem;

        #header_name {
            flex: 1;
        }
    }
</style>
