<script lang="ts">
	import type { CustomDropzoneProps, DropzoneEvent, RejectedFile } from '$lib/index.js';
	import Dropzone from '$lib/index.js';
	import Files from './Files.svelte';
	let dropzoneElement: HTMLElement | undefined = $state();
	let isDraggingOver = $state(false);

	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		files = e;
		isDraggingOver = false;
	}
	$effect(() => {
		if (isDraggingOver) {
			dropzoneElement?.classList.add('hover');
		} else {
			dropzoneElement?.classList.remove('hover');
		}
	});
</script>

{#snippet CustomDropzone(props: CustomDropzoneProps)}
	<div bind:this={dropzoneElement} class="dropzone custom-dropzone" {...props}>Custom Dropzone</div>
{/snippet}

<Dropzone
	onDragenter={(e) => {
		isDraggingOver = true;
	}}
	onDragleave={(e) => {
		isDraggingOver = false;
	}}
	{dropzoneElement}
	onDrop={handleFilesSelect}
	{CustomDropzone}
></Dropzone>
<Files {...files} />
