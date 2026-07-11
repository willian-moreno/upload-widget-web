import { useUploads } from '../store/uploads'
import { UploadWidgetUploadItem } from './upload-widget-upload-item'

export function UploadWidgetUploadList() {
  const uploads = useUploads((state) => state.uploads)

  const isUploadListEmpty = uploads.size === 0

  return (
    <div className="flex flex-col gap-3 px-3">
      <span className="font-medium text-xs">
        Uploaded files <span>({uploads.size})</span>
      </span>
      {isUploadListEmpty ? (
        <span className="text-xs text-zinc-400">No uploads added</span>
      ) : (
        <div className="space-y-2">
          {[...uploads.entries()].map(([uploadId, upload]) => (
            <UploadWidgetUploadItem
              key={uploadId}
              uploadId={uploadId}
              upload={upload}
            />
          ))}
        </div>
      )}
    </div>
  )
}
