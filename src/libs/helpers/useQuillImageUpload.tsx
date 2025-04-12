import { useEffect } from 'react'

import { toast } from 'react-toastify'

import { uploadImage } from '@/data/media/mediaQuery'

export const useQuillImageUpload = (quillRef: React.RefObject<any>) => {
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()

      quill.getModule('toolbar').addHandler('image', () => {
        const input = document.createElement('input')

        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
          if (!input.files) {
            toast.error('No file selected')

            return
          }

          const file = input.files[0]

          try {
            const result = await uploadImage(file)
            const range = quill.getSelection()

            quill.insertEmbed(range.index, 'image', result.url)
          } catch (error) {
            toast.error('Failed to upload image')
          }
        }
      })
    }
  }, [quillRef])
}
