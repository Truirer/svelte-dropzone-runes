<script lang="ts">
	import type { RejectedFile } from '$lib/types.js';

	let {
		acceptedFiles,
		rejectedFiles
	}: { acceptedFiles: File[]; rejectedFiles: RejectedFile<File>[] } = $props();
</script>

<ol>
	Accepted Files
	{#each acceptedFiles as item}
		<li>{item.name}</li>
	{/each}
</ol>

<ol>
	Rejected Files
	{#each rejectedFiles as item}
		<li>
			File Name: {item.file.name}
			<div style="display: flex;flex-direction:column">
				<p>Rejection Reasons :</p>
				<ul>
					{#each item.errors as error, index (index)}
						<li>{error?.code}</li>
					{/each}
				</ul>
			</div>
		</li>
	{/each}
</ol>
