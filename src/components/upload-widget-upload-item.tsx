import * as Progress from '@radix-ui/react-progress'
import { Download, ImageUp, Link2, RefreshCcw, X } from 'lucide-react'
import { motion } from 'motion/react'
import { type Upload, useUploads } from '../store/uploads'
import { downloadUrl } from '../utils/download-url'
import { formatBytes } from '../utils/format-bytes'
import { Button } from './ui/button'

interface UploadWidgetUploadItemProps {
  uploadId: string
  upload: Upload
}

export function UploadWidgetUploadItem({ uploadId, upload }: UploadWidgetUploadItemProps) {
  const retryUpload = useUploads((store) => store.retryUpload)

  const cancelUpload = useUploads((store) => store.cancelUpload)

  const reducedFileName =
    upload.name.length <= 30
      ? upload.name
      : upload.name.replace(/^(.{15}).+(.{5}\.\w+)$/, '$1...$2')

  const progressPercentage = Math.min(
    upload.compressedSizeInBytes
      ? Math.round((upload.uploadSizeInBytes * 100) / upload.compressedSizeInBytes)
      : 0,
    100,
  )

  const reducedPercentageOfBytes = upload.compressedSizeInBytes
    ? Math.round((1 - upload.compressedSizeInBytes / upload.originalSizeInBytes) * 100)
    : 0

  async function handleDownloadCompressedImage() {
    if (!upload.remoteUrl || !upload.compressedName) {
      return
    }

    await downloadUrl(upload.remoteUrl, upload.compressedName)
  }

  async function handleCopyRemoteUrl() {
    if (!upload.remoteUrl) {
      return
    }

    await navigator.clipboard.writeText(upload.remoteUrl)
  }

  async function handleRetryUpload() {
    retryUpload(uploadId)
  }

  async function handleCancelUpload() {
    cancelUpload(uploadId)
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="relative flex flex-col gap-3 overflow-hidden rounded-lg bg-white/2 p-3 shadow-shape-content"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1 font-medium text-xs">
          <ImageUp
            className="size-3 text-zinc-300"
            strokeWidth={1.5}
          />
          <span>{reducedFileName}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xxs text-zinc-400">
          <span className="line-through">{formatBytes(upload.originalSizeInBytes)}</span>
          <div className="size-1 rounded-full bg-zinc-700" />
          <span>
            {formatBytes(upload.compressedSizeInBytes ?? 0)}
            {upload.compressedSizeInBytes && (
              <span className="ml-1 text-green-400">-{reducedPercentageOfBytes}%</span>
            )}
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          {upload.status === 'success' && <span>100%</span>}
          {upload.status === 'progress' && <span>{progressPercentage}%</span>}
          {upload.status === 'error' && <span className="text-red-400">Error</span>}
          {upload.status === 'canceled' && <span className="text-amber-400">Canceled</span>}
        </span>
      </div>

      <Progress.Root
        value={progressPercentage}
        data-status={upload.status}
        className="group h-1 overflow-hidden rounded-full bg-zinc-800"
      >
        <Progress.Indicator
          className="h-1 rounded-full bg-indigo-500 group-data-[status=success]:bg-green-400 group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-amber-400 transition-all"
          style={{ width: upload.status === 'progress' ? `${progressPercentage}%` : '100%' }}
        />
      </Progress.Root>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button
          size="icon-sm"
          disabled={upload.status !== 'success'}
          onClick={handleDownloadCompressedImage}
        >
          <Download
            className="size-4"
            strokeWidth={1.5}
          />
          <span className="sr-only">Download compressed image</span>
        </Button>
        <Button
          size="icon-sm"
          disabled={!upload.remoteUrl}
          onClick={handleCopyRemoteUrl}
        >
          <Link2
            className="size-4"
            strokeWidth={1.5}
          />
          <span className="sr-only">Copy remote URL</span>
        </Button>
        <Button
          size="icon-sm"
          disabled={!['canceled', 'error'].includes(upload.status)}
          onClick={handleRetryUpload}
        >
          <RefreshCcw
            className="size-4"
            strokeWidth={1.5}
          />
          <span className="sr-only">Retry upload</span>
        </Button>
        <Button
          size="icon-sm"
          disabled={upload.status !== 'progress'}
          onClick={handleCancelUpload}
        >
          <X
            className="size-4"
            strokeWidth={1.5}
          />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </motion.div>
  )
}
