'use client'
import { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import {
  Box,
  FormControl,
  FormHelperText,
  Typography,
  CircularProgress,
  IconButton,
  styled
} from '@mui/material'
import { IconCloudUpload, IconTrashX } from '@tabler/icons-react'

type MediaUploaderProps = {
  label: string
  mediaType: 'video' | 'pdf'
  onUpload: (file: File, type: 'image' | 'video' | 'pdf') => Promise<{ url: string; id?: string }>
  maxSize?: number
  value?: string
  onChange?: (url: string | null) => void
  error?: string
}

const DropzoneArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.grey[700]
  }
}))

const MediaUploader = ({
  label,
  mediaType,
  onUpload,
  maxSize = mediaType === 'video' ? 10485760 : 2097152,
  value,
  onChange,
  error
}: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const getAcceptedFormats = () => {
    switch (mediaType) {

      case 'video':
        return { 'video/*': [''] }
      case 'pdf':
        return { 'application/pdf': [''] }

      default:
        return {}
    }
  }

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!file) return

      let type: 'image' | 'video' | 'pdf' = 'video'
      const fileType = file.type

      if (fileType.startsWith('image/')) type = 'image'
      else if (fileType.startsWith('video/')) type = 'video'
      else if (fileType === 'application/pdf') type = 'pdf'

      try {
        setUploading(true)
        const result = await onUpload(file, type)

        onChange?.(result.url)
      } catch (err: any) {
        console.error(err)
        setLocalError(err.message || 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [onUpload, onChange]
  )

  const onDropRejected = (fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      const errorCodes = rejection.errors.map((e: { code: string }) => e.code)

      if (errorCodes.includes('file-too-large')) {
        setLocalError(`File size exceeds limit of ${maxSize / 1024 / 1024}MB`)
      } else if (errorCodes.includes('file-invalid-type')) {
        setLocalError(`Invalid file type. Only ${mediaType} allowed.`)
      } else {
        setLocalError('File rejected. Please check the file and try again.')
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected,
    accept: getAcceptedFormats(),
    maxSize,
    multiple: false
  })

  const handleRemove = () => {
    onChange?.(null)
  }

  const isPDF = value?.endsWith('.pdf')

  return (
    <FormControl fullWidth error={!!error || !!localError}>
      <Typography variant='body1' gutterBottom>
        {label}
      </Typography>

      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant='body2'>Drop the file here...</Typography>
        ) : (
          <Box display='flex' flexDirection='column' alignItems='center' gap={1}>
            <IconCloudUpload color='action' fontSize='large' />
            <Typography variant='body2' color='textSecondary'>
              Drag & drop {mediaType} here, or click to select one (max {maxSize / 1024 / 1024}MB)
            </Typography>
          </Box>
        )}
      </DropzoneArea>

      {(error || localError) && (
        <FormHelperText sx={{ color: 'error.main', mt: 1 }}>{error || localError}</FormHelperText>
      )}

      {uploading && (
        <Box display='flex' alignItems='center' gap={1} mt={2}>
          <CircularProgress size={20} />
          <Typography variant='body2' color='primary'>
            Uploading {mediaType}...
          </Typography>
        </Box>
      )}

      {!uploading && value && (
        <Box mt={2} position='relative'>
          {isPDF ? (
            <Box
              component='a'
              href={value}
              target='_blank'
              rel='noopener noreferrer'
              sx={{
                display: 'block',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper'
              }}
            >
              <Typography variant='body2'>View uploaded PDF</Typography>
            </Box>
          ) : value.includes('video') ? (
            <video src={value} controls style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
          ) : (
            <img src={value} alt={label} style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
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
