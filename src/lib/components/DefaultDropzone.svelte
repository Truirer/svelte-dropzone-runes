<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CustomDropzoneProps } from './types.js';
	interface DefaultDropzone extends CustomDropzoneProps {
		defaultDropzoneElement: HTMLElement | undefined;
		children: Snippet;
	}
	let { defaultDropzoneElement = $bindable(), children, ...props }: DefaultDropzone = $props();
</script>

<div bind:this={defaultDropzoneElement} class="dropzone" {...props}>
	{@render children()}
</div>

<style>
	.dropzone {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		border-width: 2px;
		border-radius: 2px;
		border-color: #eeeeee;
		border-style: dashed;
		background-color: #fafafa;
		color: #bdbdbd;
		outline: none;
		transition: border 0.24s ease-in-out;
	}
	.dropzone:hover {
		border-color: #2196f3;
	}
	.dropzone:focus {
		border-color: #2196f3;
	}
</style>
