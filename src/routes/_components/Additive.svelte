<script lang="ts">
	import Dropzone, { type DropzoneEvent } from '$lib/index.js';
	import Files from './Files.svelte';

	let files = $state({
		acceptedFiles: [] as any[],
		rejectedFiles: [] as any[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		const { acceptedFiles, rejectedFiles } = e;
		files.acceptedFiles = [...files.acceptedFiles, ...acceptedFiles];
		files.rejectedFiles = [...files.rejectedFiles, ...rejectedFiles];
	}
</script>

<Dropzone onDrop={handleFilesSelect} />
<Files {...files} />
