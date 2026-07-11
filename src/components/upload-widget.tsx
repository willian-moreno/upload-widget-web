import * as Collapsible from '@radix-ui/react-collapsible'
import { motion, useCycle } from 'motion/react'
import { usePendingUploads } from '../store/uploads'
import { UploadWidgetDropzone } from './upload-widget-dropzone'
import { UploadWidgetHeader } from './upload-widget-header'
import { UploadWidgetMinimizedButton } from './upload-widget-minimized-button'
import { UploadWidgetUploadList } from './upload-widget-upload-list'

export function UploadWidget() {
  const { isThereAnyPendingUploads } = usePendingUploads()

  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true)

  return (
    <Collapsible.Root
      asChild
      onOpenChange={() => toggleWidgetOpen()}
      open={isWidgetOpen}
    >
      <motion.div
        animate={isWidgetOpen ? 'open' : 'closed'}
        className="max-w-90 animate-border-angle overflow-hidden rounded-xl border border-transparent bg-zinc-900 data-[state=closed]:data-[progress=false]:shadow-shape data-[state=open]:min-w-72 data-[state=closed]:rounded-3xl data-[state=open]:shadow-shape data-[state=closed]:data-[progress=true]:[background:linear-gradient(45deg,#09090B,--theme(--color-zinc-900)_50%,#09090B)_padding-box,conic-gradient(from_var(--border-angle),--theme(--color-zinc-700/.48)_80%,--theme(--color-indigo-500)_86%,--theme(--color-indigo-300)_90%,--theme(--color-indigo-500)_94%,--theme(--color-zinc-600/.48))_border-box]"
        data-progress={isThereAnyPendingUploads}
        variants={{
          closed: {
            height: 44,
            maxWidth: 'max-content',
            width: 'max-content',
            transition: {
              type: 'inertia',
            },
          },
          open: {
            height: 'auto',
            width: '100%',
            transition: {
              duration: 0.15,
            },
          },
        }}
      >
        {!isWidgetOpen && <UploadWidgetMinimizedButton />}
        <Collapsible.Content>
          <UploadWidgetHeader />
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />
            <div className="h-0.5 border-black/50 border-t bg-zinc-800" />
            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  )
}
