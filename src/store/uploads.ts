import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { uploadFileToStorage } from '../http/upload-file-to-storage'

export type Upload = {
  name: string
  file: File
  status: 'progress' | 'success' | 'error' | 'canceled'
  abortController: AbortController
}

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
}

enableMapSet()

export const useUploads = create<UploadsState, [['zustand/immer', never]]>(
  immer((set, get) => {
    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      try {
        await uploadFileToStorage(
          {
            file: upload.file,
          },
          {
            signal: upload.abortController.signal,
          },
        )

        set((state) => {
          state.uploads.set(uploadId, {
            ...upload,
            status: 'success',
          })
        })
      } catch {
        set((state) => {
          state.uploads.set(uploadId, {
            ...upload,
            status: 'error',
          })
        })
      }
    }

    async function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      upload.abortController.abort()

      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          status: 'canceled',
        })
      })
    }

    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID()
        const upload: Upload = {
          file,
          name: file.name,
          status: 'progress',
          abortController: new AbortController(),
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
      cancelUpload,
      uploads: new Map(),
    }
  }),
)
