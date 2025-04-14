import type { DropzoneErrorTypes } from "$lib/utils/types.js"
import type { Snippet } from "svelte"
import type { EventHandler } from "svelte/elements"

export type FromEventFileTypes = File | DataTransferItem
export type RejectedFile<T> = { file: T, errors: DropzoneErrorTypes[] }

export type DropzoneEvent<T> = {
    acceptedFiles: T[],
    rejectedFiles: RejectedFile<T>[],
    event: DragEvent | Event
}
export type DropzoneEventHandler<T> = (data: DropzoneEvent<T>) => void | undefined
//for more information 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types

export type MimeTypes =
    "audio/aac" |
    "application/x-abiword" |
    "image/apng" |
    "application/x-freearc" |
    "image/avif" |
    "video/x-msvideo" |
    "application/vnd.amazon.ebook" |
    "application/octet-stream" |
    "image/bmp" |
    "application/x-bzip" |
    "application/x-bzip2" |
    "application/x-cdf" |
    "application/x-csh" |
    "text/css" |
    "text/csv" |
    "application/msword" |
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" |
    "application/vnd.ms-fontobject" |
    "application/epub+zip" |
    "application/gzip." |
    "image/gif" |
    "text/html" |
    "image/vnd.microsoft.icon" |
    "text/calendar" |
    "application/java-archive" |
    "image/jpeg" |
    "text/javascript" |
    "application/json" |
    "application/ld+json" |
    "audio/midi, audio/x-midi" |
    "text/javascript" |
    "audio/mpeg" |
    "video/mp4" |
    "video/mpeg" |
    "application/vnd.apple.installer+xml" |
    "application/vnd.oasis.opendocument.presentation" |
    "application/vnd.oasis.opendocument.spreadsheet" |
    "application/vnd.oasis.opendocument.text" |
    "audio/ogg" |
    "video/ogg" |
    "application/ogg" |
    "audio/ogg" |
    "font/otf" |
    "image/png" |
    "application/pdf" |
    "application/x-httpd-php" |
    "application/vnd.ms-powerpoint" |
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" |
    "application/vnd.rar" |
    "application/rtf" |
    "application/x-sh" |
    "image/svg+xml" |
    "application/x-tar" |
    "image/tiff" |
    "video/mp2t" |
    "font/ttf" |
    "text/plain" |
    "application/vnd.visio" |
    "audio/wav" |
    "audio/webm" |
    "video/webm" |
    "image/webp" |
    "font/woff" |
    "font/woff2" |
    "application/xhtml+xml" |
    "application/vnd.ms-excel" |
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" |
    "application/xml" |
    "application/vnd.mozilla.xul+xml" |
    "application/zip." |
    "video/3gpp" |
    "audio/3gpp" |
    "video/3gpp2" |
    "audio/3gpp2" |
    "application/x-7z-compressed"


export interface DropzoneAreaEvents {
    dragenter: EventHandler<DragEvent> | null
    dragover: EventHandler<DragEvent> | null
    dragleave: EventHandler<DragEvent> | null
    drop: EventHandler<DragEvent> | null,
}
/** 
 * Custom Dropzone Event Handlers and props to make element act as dropzone inside the library.
 * Don't override listeners in order to make library function.
 */

export interface CustomDropzoneProps {
    'data-drozone-element-type': string,
    id: string,
    tabindex: number,
    role: string,
    onkeydown?: EventHandler<KeyboardEvent> | null
    onclick?: EventHandler<MouseEvent> | null
}


export interface DropzoneProps {
    accept?: MimeTypes[] | string[],
    disabled?: boolean,
    maxSize?: number,
    minSize?: number,
    multiple?: boolean,
    maxFileCountPerUpload?: number,
    preventDropOnDocument?: boolean,
    disableDropzoneClick?: boolean,
    disableDropzoneKeydown?: boolean,
    disableDropzoneDrag?: boolean,
    name?: string,
    required?: boolean,
    inputElement?: HTMLInputElement,
    dropzoneElement?: HTMLElement | undefined
    CustomDropzone?: Snippet<[CustomDropzoneProps]> | undefined,
    children?: Snippet,
    onDragenter?: DropzoneEventHandler<DataTransferItem>
    onDragover?: DropzoneEventHandler<DataTransferItem>
    onDragleave?: DropzoneEventHandler<DataTransferItem>
    onDrop?: DropzoneEventHandler<File>
    onFileDialogCancel?: () => void,
}