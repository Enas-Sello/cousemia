import React, { useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useDropzone } from 'react-dropzone'

import CustomAvatar from '@/@core/components/mui/Avatar'

type FileProp = {
  name: string
  type: string
  size: number
}


const ImageUploader = ({ setThumb }: { setThumb: (thumb: string) => void }) => {
  
  // States
  const [files, setFiles] = useState<File[]>([])
  const [image, setImage] = useState<string>('')
  
  console.log("🚀 ~ setThumb:", setThumb)
console.log("🚀 ~ setImage:", setImage)
console.log("🚀 ~ image:", image)



  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const img = files.map((file: FileProp, index) => {
    //@ts-ignore
    //@ts-expect-error
    const thumb = URL.createObjectURL(file as any)(thumb)

    return <CustomAvatar key={index} src={thumb} size={200} variant='square' className='rounded-lg' />
  })

  useEffect(() => {
    files
  }, [files])

  return (
    <Box {...getRootProps({ className: 'dropzone' })} {...(files.length && { sx: { height: 200 } })}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <div className='flex items-center flex-col'>
          <CustomAvatar variant='rounded' className='bs-12 is-12 mbe-9' size={150}>
            <i className='tabler-upload' />
          </CustomAvatar>
        </div>
      )}
    </Box>
  )
}

export default ImageUploader
