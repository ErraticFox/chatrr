<script lang="ts">
	import { page } from "$app/stores";
	import { userChatStatusStore } from "$lib/client/stores";
	import { Circle2 } from 'svelte-loading-spinners';

	$: userChatStatus = $userChatStatusStore || $page.data.userChatStatus;
</script>

<div id="messages">
	messages

	{#if userChatStatus.status === 'searching'}
		<div class="loading">
			<Circle2 durationMultiplier={.5} />
		</div>
	{/if}
</div>

<style lang="scss">
	#messages {
		flex: 1;
		margin: 0 1rem;

		.loading {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
