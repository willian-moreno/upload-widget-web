import { create } from 'zustand'

export type Upload = {
  name: string
  file: File
}

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
}

export const useUploads = create<UploadsState>((set, get) => {
  function addUploads(files: File[]) {
    for (const file of files) {
      const uploadId = crypto.randomUUID()
      const upload: Upload = {
        file,
        name: file.name,
      }

      set((state) => {
        return {
          uploads: state.uploads.set(uploadId, upload),
        }
      })
    }

    return files
  }

  return {
    addUploads,
    uploads: new Map(),
  }
})
