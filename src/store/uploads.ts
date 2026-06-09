import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type Upload = {
  name: string
  file: File
}

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
}

enableMapSet()

export const useUploads = create<UploadsState, [['zustand/immer', never]]>(
  immer((set) => {
    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID()
        const upload: Upload = {
          file,
          name: file.name,
        }

        set((state) => {
          state.uploads.set(uploadId, upload)
        })
      }

      return files
    }

    return {
      addUploads,
      uploads: new Map(),
    }
  }),
)
