<script lang="ts">
	import { browser } from '$app/environment';
	import type { DropzoneEvent, RejectedFile } from '$lib/index.js';
	import Dropzone from '$lib/index.js';
	import Files from './Files.svelte';
	let dropzoneElement: HTMLElement | undefined = $state(
		browser ? document.documentElement : undefined
	);
	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	let isDraggingOver = $state(false);

	function handleFilesSelect(e: DropzoneEvent<File>) {
		files = e;
		isDraggingOver = false;
	}
</script>

{#if isDraggingOver}
	<div
		style="width: 100dvw;height:100dvh;position:fixed;left:0%;top:0%;background:white;display:flex;justify-content:center;align-items:center"
	>
		<div
			class="dropzone"
			style="width:calc(100% - 100px);height:calc(100% - 100px);display:flex;justify-content:center;align-items:center;margin:50px;"
		>
			Drop Here
		</div>
	</div>
{/if}

<Dropzone
	onDragenter={(e) => {
		isDraggingOver = true;
	}}
	onDragleave={(e) => {
		isDraggingOver = false;
	}}
	{dropzoneElement}
	onDrop={handleFilesSelect}
></Dropzone>
<Files {...files} />
