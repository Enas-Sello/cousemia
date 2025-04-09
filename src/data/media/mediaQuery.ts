
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { API_MEDIA, API_MEDIA_PDF, API_MEDIA_VIDEO, API_URL } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Upload image (question image or explanation image)
export const uploadImage = async (file: File): Promise<{ id: number; url: string }> => {
  const formData = new FormData()

  formData.append('name', 'my-picture')
  formData.append('media', file)

  const response = await genericQueryFn({
    url: API_MEDIA,
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })


  return { id: response.data.id, url: response.data.url }
}

// Upload MP3 or recorded voice to /api/v1/en/admin/notes/upload-video
export const uploadAudio = async (file: File, route: string): Promise<string> => {
  const formData = new FormData()

  formData.append('name', 'my-pdf') // Note: The API expects 'my-pdf' as the name for audio files
  formData.append('file', file)

  const response = await genericQueryFn({
    url: `${API_URL}/${route}${API_MEDIA_PDF}`,

    // url: `${API_URL}/${route}${API_MEDIA_VIDEO}`,
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.path
}

// Upload PDF to /api/v1/en/admin/notes/upload-pdf (for future use)
export const uploadPDF = async (file: File): Promise<string> => {
  const formData = new FormData()

  formData.append('name', 'my-pdf')
  formData.append('file', file)

  const response = await genericQueryFn({
    url: API_MEDIA_PDF,
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.path
}
