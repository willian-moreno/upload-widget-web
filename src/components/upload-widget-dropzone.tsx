import { motion } from 'motion/react'
import { useDropzone } from 'react-dropzone'
import { usePendingUploads, useUploads } from '../store/uploads'
import { CircularProgressBar } from './ui/circular-progress-bar'

export function UploadWidgetDropzone() {
  const amountOfUploads = useUploads(store => store.uploads.size)

  const addUploads = useUploads(store => store.addUploads)

  const { isThereAnyPendingUploads, globalPercentage } = usePendingUploads()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
    },
    onDrop(acceptedFiles) {
      addUploads(acceptedFiles)
    },
  })

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-col gap-3 px-3"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-zinc-700 border-dashed bg-black/20 p-5 text-zinc-400 transition-colors hover:border-zinc-600 data-[drag-active=true]:border-indigo-500 data-[drag-active=true]:bg-indigo-500/10 data-[drag-active=true]:text-indigo-400"
        data-drag-active={isDragActive}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {isThereAnyPendingUploads ? (
          <div className="flex flex-col items-center gap-2.5">
            <CircularProgressBar
              progress={globalPercentage}
              size={56}
              strokeWidth={4}
            />
            <span className="text-xs">
              Uploading {amountOfUploads} files...
            </span>
          </div>
        ) : (
          <>
            <span className="text-xs">Drop your files here or</span>
            <span className="text-xs underline">click to open picker</span>
          </>
        )}
      </div>
      <span className="text-xxs text-zinc-400">
        Only PNG and JPG files are supported.
      </span>
    </motion.div>
  )
}
