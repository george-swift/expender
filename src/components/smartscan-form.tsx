'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { onSmartScanResultAvailable } from '@/graphql/subscriptions'
import { useSession } from '@clerk/nextjs'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import axios, { AxiosProgressEvent } from 'axios'
import { toast } from 'sonner'

import { env } from '@/env'

import { cn } from '@/lib/utils'
import { Expense } from '@/lib/validations/expenses'
import { ExpenseForm } from '@/components/expense-form'
import { Badge } from '@/components/ui/badge'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { FileUploader } from '@/components/ui/file-uploader'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createPresignedPostURLForUploads } from '@/app/actions/expenses'

Amplify.configure({
  API: {
    GraphQL: {
      defaultAuthMode: 'lambda',
      endpoint: env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT,
      region: env.NEXT_PUBLIC_AWS_REGION
    }
  }
})

const client = generateClient()

interface SmartScanFormProps {
  close?: () => void
}

// Possible states throughout the Smart Scan process
type ProcessState = 'error' | 'idle' | 'scanning' | 'uploading'

/*
 * - Smart Scan times out if no result is received within 20 seconds.
 * - The progress of data extraction is simulated over approximately 10 seconds, and updated at 100ms intervals.
 * - Precise tracking of AI data extraction may be implemented in the future but for now this provides some feedback for the user.
 */
const TIMEOUT_MS = 20_000
const PROGRESS_DURATION_MS = 10_000
const PROGRESS_INTERVAL_MS = 100

export function SmartScanForm({ close }: SmartScanFormProps) {
  const { session } = useSession()

  const fileRef = useRef<Expense['receipt']>(null)
  const [scanResult, setScanResult] = useState<null | Expense>(null)
  const [processState, setProcessState] = useState<ProcessState>('idle')

  const [dataExtractionProgress, setDataExtractionProgress] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)

  const dataExtractionProgressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null)

  const isUploadingRef = useRef(false)

  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  const cleanupTimers = useCallback(() => {
    if (dataExtractionProgressTimerRef.current) {
      clearInterval(dataExtractionProgressTimerRef.current)
      dataExtractionProgressTimerRef.current = null
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current)
      timeoutTimerRef.current = null
    }
  }, [])

  const startScanProgress = useCallback(() => {
    cleanupTimers()
    setProcessState('scanning')
    setDataExtractionProgress(0)

    const increment = 100 / (PROGRESS_DURATION_MS / PROGRESS_INTERVAL_MS)

    dataExtractionProgressTimerRef.current = setInterval(() => {
      setDataExtractionProgress(prev => {
        const factor = prev < 50 ? 1 : prev < 80 ? 0.8 : 0.5
        const next = prev + increment * factor
        if (next >= 95) {
          clearInterval(dataExtractionProgressTimerRef.current!)
          dataExtractionProgressTimerRef.current = null
          return 95
        }
        return next
      })
    }, PROGRESS_INTERVAL_MS)

    timeoutTimerRef.current = setTimeout(() => {
      toast.error('Smart Scan timed out. Please try again or check your file.')
      setProcessState('error')
      cleanupTimers()
    }, TIMEOUT_MS)
  }, [cleanupTimers])

  const onUpload = useCallback(
    async (uploadedFile: File) => {
      setProcessState('uploading')
      setUploadProgress(0)
      isUploadingRef.current = true

      try {
        const { data: presigned, error: presignedError } =
          await createPresignedPostURLForUploads(uploadedFile)

        if (presignedError || !presigned) {
          setUploadProgress(0)
          toast.error(presignedError || 'Failed to get upload URL')
          setProcessState('error')
          isUploadingRef.current = false
          return
        }

        const { formUrl, formData, url } = presigned
        const form = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
          form.append(key, value as string)
        })
        form.append('file', uploadedFile)

        await axios.post(formUrl, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              )
              setUploadProgress(percent)
            }
          }
        })

        fileRef.current = {
          name: uploadedFile.name,
          size: uploadedFile.size,
          url
        }

        isUploadingRef.current = false
        setUploadProgress(100)
        startScanProgress()
      } catch {
        setUploadProgress(0)
        toast.error('Upload failed. Please try again.')
        setProcessState('error')
        cleanupTimers()
        isUploadingRef.current = false
      }
    },
    [startScanProgress, cleanupTimers]
  )

  const setupSmartScanSubscription = useCallback(async () => {
    if (subscriptionRef.current) return

    const userId = session?.user.id
    if (!userId) {
      toast.error('User ID not found. Please sign in again.')
      return
    }

    const authToken = await session?.getToken()
    if (!authToken) {
      toast.error('You must be signed in to use Smart Scan')
      return
    }

    subscriptionRef.current = client
      .graphql({
        authToken,
        query: onSmartScanResultAvailable,
        variables: { userId }
      })
      .subscribe({
        error: () => {
          toast.warning(
            'Connection to Smart Scan service lost. Please try again.'
          )
          cleanupTimers()
          setProcessState('error')
        },
        next: ({ data }) => {
          if (!data?.onSmartScanResultAvailable) return

          const { result, scanId } = data.onSmartScanResultAvailable

          if (!scanId || !result) {
            cleanupTimers()
            setProcessState('error')
            return
          }

          const { __typename, confidence, ...extractedData } = result

          if (__typename !== 'ScanResult') {
            cleanupTimers()
            setProcessState('error')
            return
          }

          setScanResult(() => ({
            ...extractedData,
            scanId,
            receipt: fileRef.current
          }))
          setDataExtractionProgress(100)
          cleanupTimers()
          setProcessState('idle')
          toast.success('Smart Scan completed successfully.', {
            description: confidence
              ? `Data extraction confidence: ${confidence}%`
              : undefined
          })
        }
      })
  }, [session, cleanupTimers])

  useEffect(() => {
    setupSmartScanSubscription()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
      cleanupTimers()
    }
  }, [setupSmartScanSubscription, cleanupTimers])

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Smart Scan{' '}
          <Badge className="ml-1" variant="outline">
            Beta
          </Badge>
        </DialogTitle>
        <DialogDescription>
          {scanResult
            ? 'Review and adjust the extracted data below before saving it as an expense.'
            : 'Upload a receipt (PDF, PNG, or JPG) to instantly extract details like date, amount, currency, etc. with the AI suite.'}
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-full mt-2 flex flex-col gap-4 max-h-[calc(100vh-12rem)]">
        {scanResult ? (
          <ExpenseForm
            close={() => {
              setScanResult(null)
              close?.()
            }}
            expense={scanResult}
            inSmartScanMode
          />
        ) : (
          <>
            <FileUploader
              {...(fileRef.current && { file: fileRef.current })}
              isDeletable={false}
              loading={
                isUploadingRef.current ||
                processState === 'uploading' ||
                processState === 'scanning'
              }
              onUpload={onUpload}
            />

            {/* Upload Progress UI */}
            {processState === 'uploading' && (
              <div className="mt-4 animate-in fade-in duration-300">
                <Progress
                  aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                  className="w-full"
                  value={uploadProgress}
                />
                <div className="text-sm text-muted-foreground mt-2 flex justify-between">
                  <span>
                    {uploadProgress < 50
                      ? 'Uploading receipt...'
                      : uploadProgress < 90
                        ? 'Processing file...'
                        : 'Preparing for analysis...'}
                  </span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadProgress > 90 &&
                    'Almost there! Setting up for Smart Scan...'}
                </p>
              </div>
            )}

            {/* Data Extraction Progress UI */}
            {processState === 'scanning' && (
              <div className="mt-4 animate-in fade-in duration-300">
                <Progress
                  aria-label={`Scan progress: ${Math.round(dataExtractionProgress)}%`}
                  className="w-full"
                  value={dataExtractionProgress}
                />
                <div className="text-sm text-muted-foreground mt-2 flex justify-between">
                  <span>
                    {dataExtractionProgress < 50
                      ? 'Analyzing receipt...'
                      : dataExtractionProgress < 95
                        ? 'Extracting information...'
                        : 'Processing results...'}
                  </span>
                  <span>{Math.round(dataExtractionProgress)}%</span>
                </div>
              </div>
            )}
          </>
        )}
      </ScrollArea>
      <DialogFooter>
        <small className="text-[10px] leading-3 text-muted-foreground">
          <span className={cn({ hidden: scanResult })}>
            The extracted data will pre-fill a form, which you can review, edit,
            and save as an expense.
          </span>{' '}
          Your data is securely processed and encrypted, with unsaved scans
          automatically deleted after 1 hour. All saved expenses are stored
          until you delete them or deactivate your account.
        </small>
      </DialogFooter>
    </>
  )
}
