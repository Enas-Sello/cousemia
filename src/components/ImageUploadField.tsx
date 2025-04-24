'use client'

import React, { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Typography, Box } from '@mui/material'
import { Controller } from 'react-hook-form'

import { IconCloudUpload } from '@tabler/icons-react'

import { uploadImage } from '@/data/media/mediaQuery'
import type { ImageUploadFieldProps, UploadedImage } from '@/types/imageType'
import Loading from './loading'

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  control,
  fieldName,
  fieldId,
  initialImageUrl,
  setValue,
  label = 'Image Preview'
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(initialImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onMutate: () => setIsUploading(true),
    onSuccess: (data: UploadedImage) => {
      console.log('Image uploaded successfully:', data)
      setValue(fieldId, data.id, { shouldValidate: true })
      setValue(fieldName, data.url, { shouldValidate: true })
      setPreviewImage(data.url)
      toast.success('Image uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload image. Please try again.')
      setPreviewImage(null)
      setValue(fieldName, undefined, { shouldValidate: true })
    },
    onSettled: () => setIsUploading(false)
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if (!file) return

    // Create preview
    const reader = new FileReader()

    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }

    reader.readAsDataURL(file)

    uploadImageMutation.mutate(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  })

  return (
    <Controller
      name={fieldName as string}
      control={control}
      rules={{ required: 'A cover image is required' }}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='h6'>{label}</Typography>

          {/* Preview area */}
          {previewImage || field.value ? (
            <Box
              component="img"
              src={previewImage || field.value}
              alt={label}
              sx={{
                width: '100%',
                maxWidth: 300,
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          ) : (
            <Typography variant='body2' color='textSecondary'>
              No image selected
            </Typography>
          )}

          {/* Dropzone area */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <Loading />
            ) : (
              <>
                <IconCloudUpload size={32} style={{ marginBottom: 8 }} />
                <Typography>
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Only JPEG, JPG, PNG, WEBP files are accepted
                </Typography>
              </>
            )}
          </Box>

          {/* Error message */}
          {error && (
            <Typography variant='body2' color='error'>
              {error.message}
            </Typography>
          )}

          {/* Clear button */}
          {/* {(previewImage || field.value) && (
            <Button
              variant='outlined'
              color='error'
              onClick={(e) => {
                e.stopPropagation()
                setPreviewImage(null)
                field.onChange(undefined)
                setValue(fieldName, undefined, { shouldValidate: true })
              }}
              disabled={isUploading}
            >
              Remove Image
            </Button>
          )} */}
        </Box>
      )}
    />
  )
}

export default ImageUploadField
