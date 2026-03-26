import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'

export const uploadSingle = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await httpClient.post<{
      success: boolean
      data: { file: string }
    }>(ENDPOINTS.UPLOAD.SINGLE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.file
  } catch (error) {
    console.error('Error uploading single file:', error)
    throw new Error('Failed to upload file')
  }
}

export const uploadMany = async (files: File[]): Promise<string[]> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await httpClient.post<{
      success: boolean
      data: { files: string[] }
    }>(ENDPOINTS.UPLOAD.MANY, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.files
  } catch (error) {
    console.error('Error uploading many files:', error)
    throw new Error('Failed to upload files')
  }
}
