import type { FromEventFileTypes, MimeTypes } from "$lib/components/types.js";
import accepts from "./attr-accept.js";
import type { DropzoneErrorCode } from "./types.js";

// Error codes
export const FILE_INVALID_TYPE = "file-invalid-type";
export const FILE_TOO_LARGE = "file-too-large";
export const FILE_TOO_SMALL = "file-too-small";
export const TOO_MANY_FILES = "too-many-files";

export const generateErrorMessage = (code: DropzoneErrorCode, props?: { accept?: string[], minSize?: number, maxSize?: number, maxFileCountPerUpload?: number }) => {
  const errorMessages = {
    INVALID_FILE_TYPE: `File type must be one of ${props?.accept?.join(",")}.`,
    FILE_TOO_LARGE: `File is larger than ${props?.maxSize} bytes.`,
    FILE_TOO_SMALL: `File is smaller than ${props?.minSize} bytes.`,
    TOO_MANY_FILES: `File count cannot be more than ${props?.maxFileCountPerUpload}.`,
    CANNOT_UPLOAD_MULTIPLE_FILES: `Cannot upload multiple files.`,
    UNKOWN: "Unkown error"
  }
  return { code, message: errorMessages[code as keyof typeof errorMessages] || errorMessages["UNKOWN"] }
}

export function checkFiles({ file, accept = [], minSize, maxSize }: { file: FromEventFileTypes, accept: MimeTypes[] | string[] | undefined, minSize: number, maxSize: number }) {
  const fileTypeErrors = getFileTypeErrors(file, accept)
  const fileSizeErrors = getFileSizeErrors(file, minSize, maxSize)
  const errors = [...fileSizeErrors, ...fileTypeErrors]
  const errorWithMessages = errors.map((error) => (generateErrorMessage(error, { accept, minSize, maxSize })))
  return { errors: errorWithMessages, isAccepted: errors?.length === 0 }


}

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export function getFileTypeErrors(file: FromEventFileTypes, accept: string[] = []) {
  const errors: DropzoneErrorCode[] = []
  const isAcceptableType =
    file.type === "application/x-moz-file" || accepts(file, accept);

  if (!isAcceptableType) {
    errors.push("INVALID_FILE_TYPE")
  }

  return errors
}

export function getFileSizeErrors(file: FromEventFileTypes, minSize: number, maxSize: number) {
  let errors: DropzoneErrorCode[] = []
  if (!("size" in file)) return errors
  if (isDefined(file.size)) {
    if (isDefined(maxSize) && file.size > maxSize) {
      errors.push("FILE_TOO_LARGE")

    }
    else if (isDefined(minSize) && file.size < minSize) {
      errors.push("FILE_TOO_SMALL")
    }

  }
  return errors

}

function isDefined(value: number) {
  return value !== undefined && value !== null;
}

// React's synthetic events has event.isPropagationStopped,
// but to remain compatibility with other libs (Preact) fall back
// to check event.cancelBubble
export function isPropagationStopped(event: Event) {
  if (typeof event.cancelBubble !== "undefined") {
    return event.cancelBubble;
  }
  return false;
}

export function isEventWithFiles(event: Event | DragEvent) {
  if ('dataTransfer' in event && event.dataTransfer) {
    return Array.prototype.some.call(
      event.dataTransfer.types,
      (type) => type === "Files" || type === "application/x-moz-file"
    );

  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
  const target = event.target as HTMLInputElement | undefined
  return target?.files;
}

function isIe(userAgent: string) {
  return (
    userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1
  );
}

function isEdge(userAgent: string) {
  return userAgent.indexOf("Edge/") !== -1;
}

export function isIeOrEdge(userAgent = window.navigator.userAgent) {
  return isIe(userAgent) || isEdge(userAgent);
}
