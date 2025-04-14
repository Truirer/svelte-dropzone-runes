<script lang="ts">
	import { fromEvent } from 'file-selector';
	import {
		checkFiles,
		generateErrorMessage,
		isEventWithFiles,
		isIeOrEdge,
		isPropagationStopped
	} from '../utils/index.js';
	import type {
		DropzoneEventHandler,
		DropzoneProps,
		FromEventFileTypes,
		RejectedFile
	} from './types.js';
	import type { EventHandler } from 'svelte/elements';
	import DefaultDropzone from './DefaultDropzone.svelte';
	import useDropzone from './UseDropzone.js';

	let {
		accept,
		disabled = false,
		maxFileCountPerUpload = Infinity,
		maxSize = Infinity,
		minSize = 0,
		multiple = false,
		preventDropOnDocument = true,
		disableDropzoneClick = false,
		disableDropzoneKeydown = false,
		disableDropzoneDrag = false,
		name = '',
		inputElement = $bindable(),
		required = false,
		dropzoneElement = $bindable(),
		CustomDropzone,
		children,
		onDragenter,
		onDragover,
		onDragleave,
		onDrop,
		onFileDialogCancel
	}: DropzoneProps = $props();

	let isFileDialogActive: boolean = $state(false);

	let defaultDropzoneElement: HTMLElement | undefined = $state();

	let dropzoneRef: HTMLElement | undefined = $derived(dropzoneElement || defaultDropzoneElement);

	let dragTargetsRef: EventTarget[] = $state([]);
	async function getFileFromEvent<T extends FromEventFileTypes>(
		event: Event
	): Promise<{ acceptedFiles: T[]; rejectedFiles: RejectedFile<T>[] }> {
		if (isPropagationStopped(event)) {
			return { acceptedFiles: [], rejectedFiles: [] };
		}
		const files = (await fromEvent(event)) as T[];
		const acceptedFiles: T[] = [];
		const rejectedFiles: RejectedFile<T>[] = [];

		files.forEach((file) => {
			const { isAccepted, errors } = checkFiles({ file, accept, minSize, maxSize });
			if (multiple && files.length > maxFileCountPerUpload) {
				rejectedFiles.push({
					file,
					errors: [...errors, generateErrorMessage('TOO_MANY_FILES', { maxFileCountPerUpload })]
				});
				return;
			}
			if (!multiple && isAccepted && acceptedFiles.length > 0) {
				rejectedFiles.push({
					file,
					errors: [generateErrorMessage('CANNOT_UPLOAD_MULTIPLE_FILES')]
				});
				return;
			}
			if (isAccepted) {
				acceptedFiles.push(file);
				return;
			}

			rejectedFiles.push({ file, errors });
		});

		return { acceptedFiles, rejectedFiles };
	}

	async function triggerEventWithFiles<T extends FromEventFileTypes>(
		event: Event,
		callbackToTrigger: DropzoneEventHandler<T> | undefined
	) {
		const files = await getFileFromEvent<T>(event);
		if (!files) return { acceptedFiles: [], rejectedFiles: [] };
		const { acceptedFiles, rejectedFiles } = files;
		callbackToTrigger?.({ acceptedFiles, rejectedFiles, event });

		return files;
	}
	// Fn for opening the file dialog programmatically
	function openFileDialog() {
		if (inputElement) {
			isFileDialogActive = true;
			inputElement.click();
		}
	}

	// open the file dialog when SPACE/ENTER occurs on the dropzone
	function onDropzoneKeyDown(event: KeyboardEvent) {
		const target = event.target as HTMLElement | null;
		const dropzoneElementType = target?.getAttribute('drozone-element-type');
		// Ignore keyboard events bubbling up the DOM tree
		if (target?.id !== 'dropzone-element' && dropzoneElementType === 'dropzone-element') {
			return;
		}

		if (event.keyCode === 32 || event.keyCode === 13) {
			event.preventDefault();
			openFileDialog();
		}
	}

	// open the file dialog when click occurs on the dropzone
	function onDropzoneClick() {
		if (disableDropzoneClick) {
			return;
		}

		// In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
		// to ensure React can handle state changes
		// See: https://github.com/react-dropzone/react-dropzone/issues/450
		if (isIeOrEdge()) {
			setTimeout(openFileDialog, 0);
		} else {
			openFileDialog();
		}
	}
	const onDropzoneDragEnter: EventHandler<DragEvent> = async (event) => {
		event.preventDefault();

		const target = event.target;
		if (target) dragTargetsRef = [...dragTargetsRef, target];

		if (isEventWithFiles(event)) {
			await triggerEventWithFiles(event, onDragenter);
		}
	};

	const onDropzoneDragOver: EventHandler<DragEvent> = async (event) => {
		event.preventDefault();

		if (event.dataTransfer) {
			try {
				event.dataTransfer.dropEffect = 'copy';
			} catch {} /* eslint-disable-line no-empty */
		}

		if (isEventWithFiles(event)) {
			await triggerEventWithFiles(event, onDragover);
		}

		return false;
	};

	const onDropzoneDragLeave: EventHandler<DragEvent> = async (event) => {
		event.preventDefault();

		// Only deactivate once the dropzone and all children have been left
		const targets = dragTargetsRef.filter(
			(target) => dropzoneRef && dropzoneRef.contains(target as Node)
		);
		// Make sure to remove a target present multiple times only once
		// (Firefox may fire dragenter/dragleave multiple times on the same element)
		const target = event.target as HTMLElement;
		const targetIdx = targets.indexOf(target);
		if (targetIdx !== -1) {
			targets.splice(targetIdx, 1);
		}
		dragTargetsRef = targets;
		if (targets.length > 0) {
			return;
		}

		if (isEventWithFiles(event)) {
			await triggerEventWithFiles(event, onDragleave);
		}
	};

	const onDropzoneDrop = async (event: DragEvent | Event) => {
		event.preventDefault();
		isFileDialogActive = false;
		dragTargetsRef = [];
		if (isEventWithFiles(event)) {
			const { acceptedFiles } = await triggerEventWithFiles(event, onDrop);
			if ('dataTransfer' in event && event.dataTransfer && inputElement) {
				const dataTransfer = new DataTransfer();
				const incomingFiles = acceptedFiles;
				incomingFiles.forEach((v) => dataTransfer.items.add(v));
				inputElement.files = dataTransfer.files;
			}
		}
		event.stopPropagation();
	};

	let getHandler = $derived(<T extends Event>(fn: EventHandler<T>) => (disabled ? null : fn));
	let getKeyboardEventHandle = $derived(<T extends Event>(fn: EventHandler<T>) =>
		disableDropzoneKeydown ? null : getHandler(fn)
	);
	let getDragEventHandler = $derived((fn: EventHandler<DragEvent>) =>
		disableDropzoneDrag ? null : getHandler(fn)
	);

	let defaultPlaceholderString = $derived(
		multiple
			? "Drag 'n' drop some files here, or click to select files"
			: "Drag 'n' drop a file here, or click to select a file"
	);

	// allow the entire document to be a drag target
	function onWindowDragOver(event: DragEvent) {
		if (preventDropOnDocument) {
			event.preventDefault();
		}
	}

	function onWindowDrop(event: DragEvent) {
		const target = event.target as HTMLElement;
		if (!preventDropOnDocument) {
			return;
		}
		if (dropzoneRef?.contains(target)) {
			// If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
			return;
		}
		event.preventDefault();
		dragTargetsRef = [];
	}

	function onInputElementClick(event: MouseEvent) {
		event.stopPropagation();
	}

	function onInputElementCancel(event: Event) {
		isFileDialogActive = false;
		onFileDialogCancel?.();
	}
	const dropzoneProps = $derived({
		'data-drozone-element-type': 'dropzone-element',
		id: 'dropzone-element',
		tabindex: 0,
		role: 'button',
		onkeydown: getKeyboardEventHandle(onDropzoneKeyDown),
		onclick: getHandler(onDropzoneClick)
	});
	const dropzoneAreaProps = $derived({
		dragenter: getDragEventHandler(onDropzoneDragEnter),
		dragover: getDragEventHandler(onDropzoneDragOver),
		dragleave: getDragEventHandler(onDropzoneDragLeave),
		drop: getDragEventHandler(onDropzoneDrop)
	});

	$effect(() => {
		const unsubscribe = useDropzone(dropzoneRef, dropzoneAreaProps);
		return () => unsubscribe();
	});
</script>

<svelte:window on:dragover={onWindowDragOver} on:drop={onWindowDrop} />

{#snippet dropzoneInput()}
	<input
		accept={accept?.join(',')}
		{multiple}
		{required}
		type="file"
		{name}
		autocomplete="off"
		tabindex="-1"
		onchange={onDropzoneDrop}
		onclick={onInputElementClick}
		bind:this={inputElement}
		style="display: none;"
		oncancel={onInputElementCancel}
	/>
{/snippet}
{#if CustomDropzone}
	{@render CustomDropzone(dropzoneProps)}

	{@render dropzoneInput()}
{:else}
	<DefaultDropzone bind:defaultDropzoneElement {...dropzoneProps}>
		{@render dropzoneInput()}
		{#if children}
			{@render children()}
		{:else}
			<p>{defaultPlaceholderString}</p>
		{/if}
	</DefaultDropzone>
{/if}
