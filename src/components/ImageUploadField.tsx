'use client'

import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Typography, Button, CircularProgress } from '@mui/material'
import { Controller } from 'react-hook-form'

import { uploadImage } from '@/data/media/mediaQuery'
import type { ImageUploadFieldProps, UploadedImage } from '@/types/imageType'

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  control,
  fieldName,
  initialImageUrl,
  setValue,
  label = 'Image Preview'
}) => {
  // State for the preview image (local preview before upload)
  const [previewImage, setPreviewImage] = useState<string | null>(initialImageUrl || null)

  // State for tracking upload status
  const [isUploading, setIsUploading] = useState(false)

  // Mutation for uploading the image
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onMutate: () => {
      setIsUploading(true)
    },
    onSuccess: (data: UploadedImage) => {
      setValue(fieldName, data.url, { shouldValidate: true }) 
      setPreviewImage(data.url) 
      toast.success('Image uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload image. Please try again.')
      setPreviewImage(initialImageUrl || null) 
      setValue(fieldName, undefined, { shouldValidate: true }) 
    },
    onSettled: () => {
      setIsUploading(false)
    }
  })

  // Handle image selection and upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Create a local preview
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }

    reader.readAsDataURL(file)

    uploadImageMutation.mutate(file)
  }

  return (
    <Controller
      name={fieldName as string}
      control={control}
      rules={{ required: 'A cover image is required' }}
      render={({ fieldState: { error } }) => (
        <div>
          <Typography variant='h6'>{label}</Typography>
          {previewImage ? (
            <img
              src={previewImage}
              alt={label}
              style={{ width: '200px', marginBottom: '10px', objectFit: 'contain' }}
            />
          ) : (
            <Typography variant='body2' color='textSecondary'>
              No image selected.
            </Typography>
          )}
          {error && (
            <Typography variant='body2' color='error'>
              {error.message}
            </Typography>
          )}
          <Typography variant='body2' color='textSecondary'>
            Only images are accepted.
          </Typography>
          <Button
            variant='contained'
            component='label'
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
          >
            {isUploading ? 'Uploading...' : 'Browse'}
            <input type='file' accept='image/*' hidden onChange={handleImageChange} />
          </Button>
        </div>
      )}
    />
  )
}

export default ImageUploadField
