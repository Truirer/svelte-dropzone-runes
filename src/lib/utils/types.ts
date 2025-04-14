export type DropzoneErrorCode = "INVALID_FILE_TYPE" |
    "FILE_TOO_LARGE" |
    "FILE_TOO_SMALL" |
    "TOO_MANY_FILES" |
    "CANNOT_UPLOAD_MULTIPLE_FILES" |
    "UNKOWN"

export type DropzoneErrorTypes = {
    message: string,
    code: DropzoneErrorCode
} | null
