// components/MediaUploader.tsx
'use client'
import { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import { Box, FormControl, FormHelperText, Typography, CircularProgress, IconButton, styled } from '@mui/material'
import { IconCloudUpload, IconTrashX } from '@tabler/icons-react'

// Props type
type MediaUploaderProps = {
  label: string // Label for the uploader (e.g., "Video Thumbnail")
  mediaType: 'image' | 'video' | 'both' // Type of media to accept
  onUpload: (file: File, type: 'image' | 'video') => Promise<{ url: string; id?: string }> // Upload handler
  maxSize?: number // Max file size in bytes (default: 2MB for images, 10MB for videos)
  value?: string // URL of the uploaded media (for preview)
  onChange?: (url: string | null) => void // Callback to update parent state
  error?: string // Error message (if any)
}

// Styled dropzone area
const DropzoneArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.grey[50],
  '&:hover': {
    backgroundColor: theme.palette.grey[100]
  }
}))

const MediaUploader = ({
  label,
  mediaType,
  onUpload,
  maxSize = mediaType === 'video' ? 10485760 : 2097152, // 10MB for videos, 2MB for images
  value,
  onChange,
  error
}: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Determine accepted file types based on mediaType
  const accept = {
    ...(mediaType === 'image' || mediaType === 'both' ? { 'image/*': [] } : {}),
    ...(mediaType === 'video' || mediaType === 'both' ? { 'video/*': [] } : {})
  }

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        setLocalError('File size exceeds limit or wrong format')

        return
      }

      const file = acceptedFiles[0]

      if (!file) return

      setLocalError(null)
      setUploading(true)

      try {
        const fileType = file.type.startsWith('image') ? 'image' : 'video'
        const result = await onUpload(file, fileType)

        if (onChange) {
          onChange(result.url)
        }
      } catch (err: any) {
        setLocalError(err.message || 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [onUpload, onChange]
  )

  // Initialize dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    onDrop
  })

  // Handle file removal
  const handleRemove = () => {
    if (onChange) {
      onChange(null)
    }
  }

  return (
    <FormControl fullWidth error={!!error || !!localError}>
      <Typography variant='body1' gutterBottom>
        {label}
      </Typography>

      {/* Dropzone Area */}
      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant='body2'>Drop the file here...</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <IconCloudUpload color='action' fontSize='large' />
            <Typography variant='body2' color='textSecondary'>
              Drag & drop {mediaType === 'both' ? 'an image or video' : mediaType} here, or click to select one (max{' '}
              {maxSize / 1024 / 1024}MB)
            </Typography>
          </Box>
        )}
      </DropzoneArea>

      {/* Error Message */}
      {(error || localError) && (
        <FormHelperText sx={{ color: 'error.main', mt: 1 }}>{error || localError}</FormHelperText>
      )}

      {/* Loading State */}
      {uploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <CircularProgress size={20} />
          <Typography variant='body2' color='primary'>
            Uploading {mediaType === 'both' ? 'media' : mediaType}...
          </Typography>
        </Box>
      )}

      {/* Media Preview */}
      {!uploading && value && (
        <Box sx={{ mt: 2, position: 'relative' }}>
          {value.includes('video') ? (
            <video src={value} controls style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          ) : (
            <img src={value} alt={label} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          )}
          <IconButton
            onClick={handleRemove}
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
          >
            <IconTrashX color='error' />
          </IconButton>
        </Box>
      )}
    </FormControl>
  )
}

export default MediaUploader
