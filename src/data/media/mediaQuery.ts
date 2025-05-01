
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

// Upload MP3 or recorded voice 
export const uploadAudio = async (file: File, route: string): Promise<string> => {
  const formData = new FormData()

  formData.append('name', 'my-audio') 
  formData.append('file', file)

  const response = await genericQueryFn({
    url: `${API_URL}/${route}${API_MEDIA_PDF}`,

    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.path
}


// Upload Video
export const uploadVideo = async (file: File, route: string): Promise<string> => {
  const formData = new FormData()

  formData.append('name', 'my-pdf') 
  formData.append('file', file)

  const response = await genericQueryFn({

    url: `${API_URL}/${route}${API_MEDIA_VIDEO}`,
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.path
}

// Upload PDF to /api/v1/en/admin/notes/upload-pdf (for future use)
export const uploadPDF = async (file: File,route:string): Promise<string> => {
  const formData = new FormData()

  formData.append('name', 'my-pdf')
  formData.append('file', file)

  const response = await genericQueryFn({
    url: `/${route}${API_MEDIA_PDF}`,
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.path
}
