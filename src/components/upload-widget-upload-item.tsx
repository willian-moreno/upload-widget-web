import * as Progress from '@radix-ui/react-progress'
import { Download, ImageUp, Link2, RefreshCcw, X } from 'lucide-react'
import { motion } from 'motion/react'
import { type Upload, useUploads } from '../store/uploads'
import { formatBytes } from '../utils/format-bytes'
import { Button } from './ui/button'

interface UploadWidgetUploadItemProps {
  uploadId: string
  upload: Upload
}

export function UploadWidgetUploadItem({ uploadId, upload }: UploadWidgetUploadItemProps) {
  const cancelUpload = useUploads((store) => store.cancelUpload)

  const progress = Math.min(
    upload.compressedSizeInBytes
      ? Math.round((upload.uploadSizeInBytes * 100) / upload.compressedSizeInBytes)
      : 0,
    100,
  )

  async function handleCopyRemoteUrl() {
    if (!upload.remoteUrl) {
      return
    }

    await navigator.clipboard.writeText(upload.remoteUrl)
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
          <span>{upload.name}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xxs text-zinc-400">
          <span className="line-through">{formatBytes(upload.originalSizeInBytes)}</span>
          <div className="size-1 rounded-full bg-zinc-700" />
          <span>
            300KB
            <span className="ml-1 text-green-400">-94%</span>
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          {upload.status === 'success' && <span>100%</span>}
          {upload.status === 'progress' && <span>{progress}%</span>}
          {upload.status === 'error' && <span className="text-red-400">Error</span>}
          {upload.status === 'canceled' && <span className="text-amber-400">Canceled</span>}
        </span>
      </div>

      <Progress.Root
        value={progress}
        data-status={upload.status}
        className="group h-1 overflow-hidden rounded-full bg-zinc-800"
      >
        <Progress.Indicator
          className="h-1 rounded-full bg-indigo-500 group-data-[status=success]:bg-green-400 group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-amber-400 transition-all"
          style={{ width: upload.status === 'progress' ? `${progress}%` : '100%' }}
        />
      </Progress.Root>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        <Button
          size="icon-sm"
          disabled={upload.status !== 'success'}
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
