/**
 * Check if the provided file type should be accepted by the input with accept attribute.
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-accept
 *
 * Inspired by https://github.com/enyo/dropzone
 *
 * @param file {File} https://developer.mozilla.org/en-US/docs/Web/API/File
 * @param accept {string}
 * @returns {boolean}
 */

import type { FromEventFileTypes, MimeTypes } from "$lib/components/types.js";


export default function (file: FromEventFileTypes, accept: MimeTypes[] | string[]): boolean {
  if (file && accept.length > 0) {

    const fileName = "name" in file ? file.name : "";
    const mimeType = (file.type || "").toLowerCase();
    const baseMimeType = mimeType.replace(/\/.*$/, "");

    return accept.some((type) => {
      const validType = type.trim().toLowerCase();
      if (validType.charAt(0) === ".") {
        return fileName.toLowerCase().endsWith(validType);
      } else if (validType.endsWith("/*")) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, "");
      }
      return mimeType === validType;
    });
  }
  return true;
}
