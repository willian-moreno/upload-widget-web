import { useDropzone } from 'react-dropzone'

export function UploadWidgetDropzone() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
    },
    onDrop(acceptedFiles) {},
  })

  return (
    <div className="flex flex-col gap-3 px-3">
      <div
        data-drag-active={isDragActive}
        className="flex flex-col items-center justify-center gap-1 h-32 cursor-pointer text-zinc-400 bg-black/20 p-5 rounded-lg border border-zinc-700 border-dashed hover:border-zinc-600 transition-colors data-[drag-active=true]:bg-indigo-500/10 data-[drag-active=true]:border-indigo-500 data-[drag-active=true]:text-indigo-400"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="text-xs">Drop your files here or</span>
        <span className="text-xs underline">click to open picker</span>
      </div>
      <span className="text-xs text-zinc-400">
        Only PNG and JPG files are supported.
      </span>
    </div>
  )
}
