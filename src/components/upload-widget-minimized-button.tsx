import * as Collapsible from '@radix-ui/react-collapsible'
import { Maximize2 } from 'lucide-react'
import { UploadWidgetTitle } from './upload-widget-title'

export function UploadWidgetMinimizedButton() {
  return (
    <Collapsible.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-x-5 bg-white/2 px-5 py-3">
      <UploadWidgetTitle />
      <Maximize2
        className="size-4 text-zinc-400 group-hover:text-zinc-100"
        strokeWidth={1.5}
      />
    </Collapsible.Trigger>
  )
}
