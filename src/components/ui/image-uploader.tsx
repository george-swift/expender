'use client'

import { SyntheticEvent, useCallback, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { CameraIcon, CropIcon, Trash2Icon } from 'lucide-react'
import Dropzone, {
  DropzoneRef,
  ErrorCode,
  FileError,
  FileRejection
} from 'react-dropzone'
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop
} from 'react-image-crop'
import { toast } from 'sonner'

import 'react-image-crop/dist/ReactCrop.css'

import { cn, formatters } from '@/lib/utils'
import { useDialog } from '@/hooks/use-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface ImageUploaderProps {
  className?: string
  disabled?: boolean
  id?: string
  imageProps?: {
    alt?: string
    className?: string
    fill?: boolean
    height?: number
    width?: number
  }
  maxSize?: number
  onDelete?: () => void
  onUpload?: (dataURL: string) => void
  src?: null | string
}

export function ImageUploader({
  className,
  disabled = false,
  id,
  imageProps,
  maxSize = 5 * 1024 * 1024, // 5MB
  onDelete,
  onUpload,
  src
}: ImageUploaderProps) {
  const dropzoneRef = useRef<DropzoneRef>(null)

  const acceptedFiles = useMemo(
    () => ({
      'image/*': ['.jpeg', '.png', '.webp']
    }),
    []
  )

  const [file, setFile] = useState<File | null>(null)
  const [fileDataUrl, setFileDataUrl] = useState('')

  const imageCropDialog = useDialog()

  const imgRef = useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = useState<Crop>()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('')

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { height, width } = e.currentTarget
    setCrop(
      centerCrop(
        makeAspectCrop(
          {
            height: 50,
            unit: '%',
            width: 50
          },
          1,
          width,
          height
        ),
        width,
        height
      )
    )
  }

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop) => {
    if (!file || !crop) {
      return
    }

    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )
    }

    return canvas.toDataURL(file?.type, 1)
  }

  const onCropComplete = (crop: PixelCrop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop)
      if (croppedImageUrl) {
        setCroppedImageUrl(croppedImageUrl)
      }
    }
  }

  const onCrop = () => {
    try {
      onUpload?.(croppedImageUrl)
      imageCropDialog.dismiss()
    } catch {
      toast.warning('Something went wrong while cropping the image.')
    }
  }

  const onDropAccepted = useCallback(
    async (files: File[]) => {
      if (!files?.length) {
        return
      }

      setFile(files[0])
      const dataURL = await new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(files[0])
      })
      setFileDataUrl(dataURL)
      imageCropDialog.trigger()
    },
    [imageCropDialog]
  )

  const onDropRejected = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const errorMessages = {
        [ErrorCode.FileInvalidType]: 'Image type is not allowed',
        [ErrorCode.FileTooLarge]: `Image size exceeds the maximum of ${formatters.fileSize(maxSize)}`,
        [ErrorCode.TooManyFiles]: 'You can only upload one image'
      } as Record<FileError['code'], string>

      const errorCode = rejectedFiles[0].errors[0].code
      const errorMessage = errorMessages[errorCode]
      onDelete?.()
      if (errorMessage) {
        toast.error('Image upload error', { description: errorMessage })
      }
    },
    [maxSize, onDelete]
  )

  return (
    <>
      <Dropzone
        accept={acceptedFiles}
        maxFiles={1}
        maxSize={maxSize}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        ref={dropzoneRef}
      >
        {({ getInputProps, getRootProps, isDragAccept, isDragReject }) => (
          <div
            className={cn(
              'group relative border rounded-full overflow-hidden',
              {
                'border-destructive text-destructive': isDragReject,
                'cursor-pointer hover:bg-black/15': !disabled,
                'flex items-center justify-center':
                  !src || isDragAccept || isDragReject,
                'opacity-50 cursor-not-allowed': disabled
              },
              className
            )}
            id={id}
            {...(src ? {} : getRootProps())}
          >
            <input {...getInputProps()} />

            {!src && !isDragAccept && (
              <CameraIcon className="size-16 stroke-1 z-10 inline-block text-muted-foreground" />
            )}

            {src && !isDragAccept && !isDragReject && (
              <>
                <div className="absolute inset-0 z-40 items-center pointer-events-none justify-center bg-black/25 hidden group-hover:flex">
                  <CameraIcon className="size-16 select-none stroke-1 text-white" />
                </div>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Image
                      height={200}
                      src={src}
                      width={200}
                      {...imageProps}
                      alt={imageProps?.alt ?? ''}
                      className={cn(
                        'rounded-full size-full object-cover',
                        imageProps?.className
                      )}
                      quality={100}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        dropzoneRef?.current?.open()
                      }}
                    >
                      <CameraIcon className="size-4" />
                      <span className="text-sm">Upload a picture...</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="group"
                      onClick={() => onDelete?.()}
                    >
                      <Trash2Icon className="size-4 text-muted-foreground group-hover:text-destructive-foreground" />
                      <span className="text-sm group-hover:text-destructive-foreground">
                        Delete picture
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        )}
      </Dropzone>

      <Dialog {...imageCropDialog.dialogProps}>
        <DialogContent className="p-0 gap-0 sm:max-w-sm">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Crop your new profile picture</DialogTitle>
          </DialogHeader>

          <div className="p-6 size-full">
            <ReactCrop
              aspect={1}
              className="w-full"
              crop={crop}
              onChange={(_, percentCrop) => {
                setCrop(percentCrop)
              }}
              onComplete={onCropComplete}
            >
              <Avatar className="size-full rounded-none">
                <AvatarImage
                  alt="Image cropper preview"
                  className="size-full rounded-none"
                  onLoad={onImageLoad}
                  ref={imgRef}
                  src={fileDataUrl}
                />
                <AvatarFallback className="size-full min-h-96 rounded-none">
                  Loading...
                </AvatarFallback>
              </Avatar>
            </ReactCrop>
          </div>

          <DialogFooter className="p-6 pt-0">
            <DialogClose asChild>
              <Button
                className="min-w-32 shadow-xs"
                onClick={() => {
                  onDelete?.()
                }}
                size="sm"
                type="reset"
                variant="outline"
              >
                <Trash2Icon className="size-4" />
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="min-w-32"
              onClick={onCrop}
              size="sm"
              type="button"
            >
              <CropIcon className="size-4" />
              Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
