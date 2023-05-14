<script lang="ts">
	import Compose from '$lib/components/compose/Compose.svelte';
	import Messages from '$lib/components/messages/Messages.svelte';
</script>

<svelte:head>
	<title>Chatrr</title>
	<meta name="description" content="Chatrr App" />
</svelte:head>

<section>
	<div id="chat">
		<Messages />
		<Compose />
	</div>
</section>

<style>
	#chat {
		display: flex;
		flex-direction: column;
		position: fixed;
		height: calc(100% - 54px);
		box-sizing: border-box;
		width: 100%;
		max-width: 64rem;
	}
</style>
