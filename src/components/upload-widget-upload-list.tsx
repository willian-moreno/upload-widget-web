import * as ScrollArea from '@radix-ui/react-scroll-area'
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
      <ScrollArea.Root
        className="overflow-hidden"
        type="scroll"
      >
        <ScrollArea.Viewport className="max-h-55">
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
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-zinc-800 p-0.5 transition-colors duration-160 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-600 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}
