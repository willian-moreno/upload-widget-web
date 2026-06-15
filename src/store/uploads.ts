import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { uploadFileToStorage } from '../http/upload-file-to-storage'

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
  immer((set, get) => {
    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      await uploadFileToStorage({
        file: upload.file,
      })
    }

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

        processUpload(uploadId)
      }

      return files
    }

    return {
      addUploads,
      uploads: new Map(),
    }
  }),
)
