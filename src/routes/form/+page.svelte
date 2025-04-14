<script lang="ts">
	import Dropzone from '$lib/components/Dropzone.svelte';
	import type { DropzoneEvent, RejectedFile } from '$lib/components/types.js';

	let dropzoneRef: HTMLElement | undefined = $state();
	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		const { acceptedFiles, rejectedFiles } = e;
		files = e;
	}
</script>

<section>
	<form method="POST" action="?/file-upload">
		<Dropzone name={'files'} dropzoneElement={dropzoneRef} multiple onDrop={handleFilesSelect} />

		<button type="submit">Submit</button>
	</form>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
