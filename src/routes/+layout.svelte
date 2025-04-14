<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<section>
	{@render children()}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		max-width: 500px;
		margin: auto;
	}
</style>
