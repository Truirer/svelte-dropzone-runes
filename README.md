# 📦 svelte-dropzone-runes
A lightweight, flexible, and fully-typed file dropzone component for Svelte 5, built with performance and customization in mind. Easily handle drag-and-drop or manual file selection with support for validation, custom rendering, and accessibility.

## ✨ Features
✅ Svelte 5-compatible (uses $props() and $state)

📁 Drag & drop or click to select files

🔎 File validation:

Accepts specific types

Min/max file size

Supports single/multiple files

🎨 Full custom UI rendering

🧩 Integration-friendly via rich event callbacks

🚫 Automatically prevents document-level drops (optional)

## 📦 Installation
```
npm install svelte-dropzone-runes
```
## 🛠 Props

| Prop                        | Type                                        | Default         | Description                                                                                                                            |
|-----------------------------|---------------------------------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `accept`                    | `string[]`                                  | `undefined`     | Accepted MIME types or file extensions (e.g., `['image/jpeg']`).                                                                       |
| `disabled`                  | `boolean`                                   | `false`         | Disables all interactions with the dropzone.                                                                                           |
| `maxSize`                   | `number`                                    | `Infinity`      | Maximum file size (in bytes).                                                                                                          |
| `minSize`                   | `number`                                    | `0`             | Minimum file size (in bytes).                                                                                                          |
| `multiple`                  | `boolean`                                   | `false`         | Allows multiple files to be selected at once. If set false only the first file will be accepted.                                       |
| `maxFileCountPerUpload`     | `number`                                    | `Infinity`      | Maximum number of files that can be uploaded at once. Requires `multiple` to be `true`.                                                |
| `preventDropOnDocument`     | `boolean`                                   | `true`          | Prevents default drag-and-drop behavior on the entire document.                                                                        |
| `disableDropzoneClick`      | `boolean`                                   | `false`         | Disables the ability to open the file dialog by clicking on the dropzone.                                                              |
| `disableDropzoneKeydown`    | `boolean`                                   | `false`         | Disables the ability to open the file dialog by pressing keys.                                                                         |
| `disableDropzoneDrag`       | `boolean`                                   | `false`         | Disables drag-and-drop functionality.                                                                                                  |
| `name`                      | `string`                                    | `''`            | The name of the input, required when used inside a form.                                                                               |
| `required`                  | `boolean`                                   | `false`         | Marks the input as required.                                                                                                           |
| `dropzoneElement`           | `HTMLElement`                               | `undefined`     | A custom dropzone HTML element. You can bind dropzone events to any element by passing it here.                                        |
| `inputElement`              | `HTMLInputElement`                          | `undefined`     | Used to access input element used inside `svelte-dropzone-runes`.                                                                      |
| `CustomDropzone`            | `Snippet<[CustomDropzoneProps]>`            | `undefined`     | Function that renders a custom dropzone element. Use with `dropzoneElement` to bind dropzone events to the custom element.             |
| `children`                  | `Snippet<[]>`                               | `undefined`     | Custom inner content (overrides the default message).                                                                                  |


## 🎯  Events

| Event                       | Types                                         | Description                                                                                                                            |
|-----------------------------|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `onDragenter`               | `DropzoneEventHandler<DataTransferItem>`      | Callback when a drag event enters the dropzone area.                                                                                   |
| `onDragover`                | `DropzoneEventHandler<DataTransferItem>`      | Callback when a file is dragged over the dropzone.                                                                                     |
| `onDragleave`               | `DropzoneEventHandler<DataTransferItem>`      | Callback when a file leaves the dropzone area.                                                                                         |
| `onDrop`                    | `DropzoneEventHandler<File>`                  | Callback when files are dropped onto the dropzone.                                                                                     |
| `onFileDialogCancel`        | `() => void`                                  | Callback when the file dialog is canceled.                                                                                             |

## 🚀 Usage
Basic Example
```svelte

<script lang="ts">
	import Dropzone, { type DropzoneEvent, type RejectedFile } from 'svelte-dropzone-runes';

	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		files = e;
	}
</script>

<Dropzone onDrop={handleFilesSelect} />

```

Custom UI

```svelte
<script lang="ts">
	import type { CustomDropzoneProps, DropzoneEvent,RejectedFile } from 'svelte-dropzone-runes';
	import Dropzone from 'svelte-dropzone-runes';
	let dropzoneElement: HTMLElement | undefined = $state();
	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		files = e;
		isDraggingOver = false;
	}
</script>

{#snippet CustomDropzone(props: CustomDropzoneProps)}
	<div bind:this={dropzoneElement} {...props}>Custom Dropzone</div>
{/snippet}

<Dropzone {dropzoneElement} onDrop={handleFilesSelect} {CustomDropzone}></Dropzone>

```

Full Page

```svelte
<script lang="ts">
	import { browser } from '$app/environment';
	import type { DropzoneEvent } from 'svelte-dropzone-runes';
	import Dropzone from 'svelte-dropzone-runes';
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
	<div style="width: 100dvw;height:100dvh;position:fixed;left:0%;top:0%;background:white;display:flex;justify-content:center;align-items:center" >
		<div
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

```

Example

```svelte
<script lang="ts">
	import type { CustomDropzoneProps, DropzoneEvent, RejectedFile } from 'svelte-dropzone-runes';
	import Dropzone from 'svelte-dropzone-runes';
	let dropzoneElement: HTMLElement | undefined = $state();
	let isDraggingOver = $state(false);

	let files = $state({
		acceptedFiles: [] as File[],
		rejectedFiles: [] as RejectedFile<File>[]
	});

	function handleFilesSelect(e: DropzoneEvent<File>) {
		const { acceptedFiles, rejectedFiles } = e;
		files.acceptedFiles = [...files.acceptedFiles, ...acceptedFiles];
		files.rejectedFiles = [...files.rejectedFiles, ...rejectedFiles];
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
	accept={["image/*"]}
	multiple
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

	.custom-dropzone {
		background-color: wheat;
		color: black;
		transition: all 0.3s;
	}

	.custom-dropzone:focus {
		padding: 40px;

	}

	.custom-dropzone:hover {
		padding: 40px;
	}

	.custom-dropzone.hover {
		padding: 40px;
	}
</style>
```

## 📚 Important Notes
The underlying logic is inspired by react-dropzone and svelte-file-dropzone but tailored for idiomatic Svelte 5 use.

If using Custom UI bind dropzoneElement to the drop target inside the CustomUI.
If using form, set name and required on the dropzone to tie into form validation.
If not using multiple drag items after the first one will be rejected.
You can't validate file size during drag events because DataTransferItem doesn't expose file size.

## 📄 License
MIT © Truirer
