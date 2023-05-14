<script lang="ts">
	import { page } from '$app/stores';
	import { signInWith, signOut } from '$lib/client/firebase';
	import { userProfileStore } from '$lib/client/stores';
	import Logout from 'svelte-material-icons/LogoutVariant.svelte';
	import Login from 'svelte-material-icons/Login.svelte';

	$: userProfile = $userProfileStore || $page.data.userProfile;
</script>

<div id="auth">
	{#if userProfile}
		{userProfile.username}
		<button class="icon" on:click={() => signOut()}>
			<Logout size="20" />
		</button>
	{:else}
		(visitor)
		<button on:click={() => signInWith('google')}>
			<Login size="20" />
		</button>
	{/if}
</div>

<style lang="scss">
	#auth {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
