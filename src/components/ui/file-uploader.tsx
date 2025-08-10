import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  DownloadIcon,
  FileScanIcon,
  FileSpreadsheetIcon,
  LoaderIcon,
  Trash2Icon
} from 'lucide-react'
import Dropzone, { ErrorCode, FileError, FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

import { cn, formatters } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

interface FileUploaderProps {
  className?: string
  disabled?: boolean
  file?: { url?: string } & Partial<File>
  id?: string
  isDeletable?: boolean
  isDownloadable?: boolean
  loading?: boolean
  maxSize?: number
  onDelete?: () => void
  onUpload?: (file: File) => void
}

export function FileUploader({
  className,
  disabled = false,
  file,
  id,
  isDeletable = true,
  isDownloadable = true,
  loading = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  onDelete,
  onUpload
}: FileUploaderProps) {
  const acceptedFiles = useMemo(
    () => ({
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    }),
    []
  )

  const onDropAccepted = useCallback(
    (files: File[]) => {
      if (!files?.length) {
        return
      }
      onUpload?.(files[0])
    },
    [onUpload]
  )

  const onDropRejected = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const errorMessages = {
        [ErrorCode.FileInvalidType]: 'File type is not allowed',
        [ErrorCode.FileTooLarge]: `File size exceeds the maximum of ${formatters.fileSize(maxSize)}`,
        [ErrorCode.TooManyFiles]: 'You can only upload one file'
      } as Record<FileError['code'], string>

      const errorCode = rejectedFiles[0].errors[0].code
      const errorMessage = errorMessages[errorCode]
      if (errorMessage) {
        toast.error('File upload error', { description: errorMessage })
      }
    },
    [maxSize]
  )

  return (
    <Dropzone
      accept={acceptedFiles}
      maxFiles={1}
      maxSize={maxSize}
      onDropAccepted={onDropAccepted}
      onDropRejected={onDropRejected}
    >
      {({ getInputProps, getRootProps, isDragAccept, isDragReject }) => (
        <div
          className={cn(
            'relative border rounded-lg',
            {
              'border-destructive text-destructive': isDragReject,
              'cursor-pointer': !disabled && !loading,
              'flex h-36 items-center rounded-lg justify-center border-dashed':
                !file || isDragAccept || isDragReject,
              'opacity-50 cursor-not-allowed': disabled
            },
            className
          )}
          id={id}
          {...(file ? {} : getRootProps())}
        >
          {loading && !file && (
            <div className="flex h-36 items-center justify-center"></div>
          )}
          {!file && !isDragAccept && !isDragReject && (
            <>
              {loading ? (
                <LoaderIcon className="animate-spin size-8 text-muted-foreground" />
              ) : (
                <div>
                  <FileScanIcon aria-hidden={true} className="mx-auto size-9" />
                  <div className="mt-2">
                    <label className="rounded-md text-sm" htmlFor="file-upload">
                      <span aria-hidden="true" className="absolute inset-0" />
                      Click
                      <input className="sr-only" {...getInputProps()} />
                    </label>
                    <span className="pl-1 text-sm">
                      to browse or drag receipt here
                    </span>
                    <p className="text-center text-xs text-muted-foreground">
                      PDF, PNG, or JPG up to {formatters.fileSize(maxSize)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {file && !isDragReject && !isDragAccept && (
            <ul className="space-y-4">
              <li className="relative rounded-lg p-4 shadow-xs" key={file.name}>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isDeletable && (
                    <Button
                      aria-label="Remove file"
                      className="hover:text-destructive"
                      disabled={loading}
                      onClick={() => onDelete?.()}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2Icon
                        aria-hidden="true"
                        className="size-5 shrink-0"
                      />
                    </Button>
                  )}
                  {isDownloadable && (
                    <Link
                      aria-disabled={loading}
                      aria-label="Download file"
                      className={buttonVariants({
                        size: 'icon',
                        variant: 'ghost'
                      })}
                      download={true}
                      href={file.url!}
                      target="_blank"
                    >
                      <DownloadIcon
                        aria-hidden="true"
                        className="size-5 shrink-0"
                      />
                    </Link>
                  )}
                </div>
                <div className="flex items-center space-x-3 truncate">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                    <FileSpreadsheetIcon
                      aria-hidden={true}
                      className="size-5 "
                    />
                  </span>
                  <div className="truncate pr-20">
                    <p className="truncate text-xs font-medium ">
                      <span>{file.name}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatters.fileSize(file.size!)}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          )}
        </div>
      )}
    </Dropzone>
  )
}
