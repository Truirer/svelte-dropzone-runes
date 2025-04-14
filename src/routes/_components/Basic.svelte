<script lang="ts">
	import Dropzone, { type DropzoneEvent, type RejectedFile } from '$lib/index.js';
	import Files from './Files.svelte';

	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		files = e;
	}
</script>

<Dropzone onDrop={handleFilesSelect} />
<Files {...files} />
