import * as Collapsible from '@radix-ui/react-collapsible'
import { motion, useCycle } from 'motion/react'
import { UploadWidgetDropzone } from './upload-widget-dropzone'
import { UploadWidgetHeader } from './upload-widget-header'
import { UploadWidgetMinimizedButton } from './upload-widget-minimized-button'
import { UploadWidgetUploadList } from './upload-widget-upload-list'

export function UploadWidget() {
  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true)

  return (
    <Collapsible.Root
      asChild
      onOpenChange={() => toggleWidgetOpen()}
      open={isWidgetOpen}
    >
      <motion.div
        animate={isWidgetOpen ? 'open' : 'closed'}
        className="w-full max-w-90 overflow-hidden rounded-xl bg-zinc-900 shadow-shape"
        variants={{
          closed: {
            height: 44,
            transition: {
              type: 'inertia',
            },
            width: 'max-content',
          },
          open: {
            height: 'auto',
            transition: {
              duration: 0.15,
            },
            width: '100%',
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
