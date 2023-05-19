<script lang="ts">
    import { page } from "$app/stores";
    import { signInWith, signOut } from "$lib/client/firebase";
    import { loading, userProfileStore } from "$lib/client/stores";
    import Logout from "svelte-material-icons/LogoutVariant.svelte";
    import Login from "svelte-material-icons/Login.svelte";
    import { setUserChatStatus, setUserPresence } from "$lib/client/chatrr-firebase";
    import DropdownMenu from "../DropdownMenu/DropdownMenu.svelte";

    $: userProfile = $userProfileStore || $page.data.userProfile;

    function logout() {
        setUserChatStatus("disconnected");
        setUserPresence("offline");
        signOut();
    }

    $: if (userProfile) loading.set(false)
</script>

<div id="auth">
	{userProfile?.username || ''}
	<DropdownMenu>
        {#if userProfile}
            <div class="menuItem" on:click={() => logout()} on:keydown={() => logout()}>Sign out</div>
        {:else}
            <div class="menuItem" on:click={() => signInWith("google")} on:keydown={() => signInWith("google")}>Sign in with Google</div>
            <div class="menuItem" on:click={() => signInWith("anonymous")} on:keydown={() => signInWith("anonymous")}>
                Sign in Anonymously
            </div>
        {/if}
    </DropdownMenu>
</div>

<style lang="scss">
    #auth {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
