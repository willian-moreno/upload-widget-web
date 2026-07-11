import { isCancel } from 'axios'
import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/shallow'
import { uploadFileToStorage } from '../http/upload-file-to-storage'
import { compressImage } from '../utils/compress-image'

export type Upload = {
  name: string
  file: File
  compressedFile?: File
  status: 'progress' | 'success' | 'error' | 'canceled'
  abortController: AbortController
  originalSizeInBytes: number
  compressedSizeInBytes?: number
  uploadSizeInBytes: number
  remoteUrl?: string
}

type UploadsState = {
  uploads: Map<string, Upload>
  addUploads: (files: File[]) => void
  cancelUpload: (uploadId: string) => void
}

enableMapSet()

export const useUploads = create<UploadsState, [['zustand/immer', never]]>(
  immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          ...data,
        })
      })
    }

    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      try {
        const compressedFile = await compressImage({
          file: upload.file,
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.8,
        })

        updateUpload(uploadId, {
          compressedFile: compressedFile,
          compressedSizeInBytes: compressedFile.size,
        })

        const { url } = await uploadFileToStorage(
          {
            file: compressedFile,
            onProgress(sizeInBytes) {
              updateUpload(uploadId, { uploadSizeInBytes: sizeInBytes })
            },
          },
          {
            signal: upload.abortController.signal,
          },
        )

        updateUpload(uploadId, { status: 'success', remoteUrl: url })
      } catch (error) {
        if (isCancel(error)) {
          updateUpload(uploadId, { status: 'canceled' })

          return
        }

        updateUpload(uploadId, { status: 'error' })
      }
    }

    async function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId)

      if (!upload) {
        return
      }

      upload.abortController.abort()
    }

    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID()
        const upload: Upload = {
          file,
          name: file.name,
          status: 'progress',
          abortController: new AbortController(),
          originalSizeInBytes: file.size,
          uploadSizeInBytes: 0,
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

export const usePendingUploads = () => {
  return useUploads(
    useShallow((store) => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some((upload) => {
        return upload.status === 'progress'
      })

      if (!isThereAnyPendingUploads) {
        return {
          isThereAnyPendingUploads,
          globalPercentage: 100,
        }
      }

      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (accumulator, upload) => {
          if (upload.compressedSizeInBytes) {
            accumulator.uploaded += upload.uploadSizeInBytes
          }

          accumulator.total += upload.compressedSizeInBytes ?? upload.originalSizeInBytes

          return accumulator
        },
        {
          total: 0,
          uploaded: 0,
        },
      )

      const globalPercentage = Math.min(Math.round((uploaded * 100) / total), 100)

      return {
        isThereAnyPendingUploads,
        globalPercentage,
      }
    }),
  )
}
