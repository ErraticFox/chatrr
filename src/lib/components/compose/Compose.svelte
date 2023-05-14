<script lang="ts">
	import Search from 'svelte-material-icons/Magnify.svelte';
	import Stop from 'svelte-material-icons/Close.svelte';
	import Send from 'svelte-material-icons/Send.svelte';
	import { userChatStatusStore } from '$lib/client/stores';
	import { page } from '$app/stores';
	import { setUserChatStatus } from "$lib/client/chatrr-firebase";

	$: userChatStatus = $userChatStatusStore || $page.data.userChatStatus;
</script>

<div id="compose">
	{#if userChatStatus.status === "searching"}
		<button class="icon searching" on:click={() => setUserChatStatus("disconnected")}>
			<Stop size="20" />
		</button>
	{:else if userChatStatus.status === "disconnected"}
		<button class="icon search" on:click={() => setUserChatStatus("searching")}>
			<Search size="20" />
		</button>
	{/if}
	<input type="text" placeholder="Connect to chat"  disabled={userChatStatus.status !== 'connected'}/>
	<button class="icon send" disabled={userChatStatus.status !== 'connected'}>
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

			&:focus {
				outline: none;
				background-color: #f5f5f5;
			}
		}

		.icon {
			margin: 0 1rem;
		}
	}
</style>
