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
      open={isWidgetOpen}
      onOpenChange={() => toggleWidgetOpen()}
      asChild
    >
      <motion.div
        className="w-full max-w-90 overflow-hidden rounded-xl bg-zinc-900 shadow-shape"
        animate={isWidgetOpen ? 'open' : 'closed'}
        variants={{
          open: {
            width: '100%',
            height: 'auto',
            transition: {
              duration: 0.15,
            },
          },
          closed: {
            width: 'max-content',
            height: 44,
            transition: {
              type: 'inertia',
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
