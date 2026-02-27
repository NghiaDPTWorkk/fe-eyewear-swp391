import { httpClient } from '@/api/apiClients'

export const uploadSingle = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await httpClient.post<{
      success: boolean
      data: { file: string }
    }>('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.file
  } catch (error) {
    console.error('Error uploading single image:', error)
    throw new Error('Failed to upload image')
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
    }>('/common/upload/many', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.files
  } catch (error) {
    console.error('Error uploading many images:', error)
    throw new Error('Failed to upload images')
  }
}
