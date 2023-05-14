<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
</script>

<div id="header">
	<a id="header_name" href="/">chatrr</a>
	<Auth />
</div>

<style lang="scss">

	#header {
		display: flex;
		align-items: center;
		
		#header_name {
			flex: 1;
		}
	}

</style>
