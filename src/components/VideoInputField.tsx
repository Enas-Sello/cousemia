'use client'

import React, { useState, useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Typography, Box } from '@mui/material'
import { Controller } from 'react-hook-form'
import { IconCloudUpload } from '@tabler/icons-react'

import { uploadVideo } from '@/data/media/mediaQuery' // Adjust based on your file
import Loading from './loading'

const VideoUploadField: React.FC<any> = ({
    control,
    fieldName,
    fieldId,
    initialVideoUrl,
    setValue,
    label = 'Video Preview'

}) => {
    const [previewVideo, setPreviewVideo] = useState<string | null>(initialVideoUrl || null)
    const [isUploading, setIsUploading] = useState(false)

    const uploadVideoMutation = useMutation({
        mutationFn: (file: File) => uploadVideo(file, 'lectures'),
        onMutate: () => setIsUploading(true),
        onSuccess: (data: any) => {
            setValue(fieldName, data.url, { shouldValidate: true })
            setValue(fieldId, data.id, { shouldValidate: true })
            setPreviewVideo(data.url)
            toast.success('Video uploaded successfully')
        },
        onError: () => {
            toast.error('Failed to upload video. Please try again.')
            setPreviewVideo(null)
            setValue(fieldName, undefined, { shouldValidate: true })
        },
        onSettled: () => setIsUploading(false)
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]

        if (!file) return

        // Optional: preview using video blob
        const blobUrl = URL.createObjectURL(file)

        setPreviewVideo(blobUrl)

        uploadVideoMutation.mutate(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mov', '.webm']
        },
        maxFiles: 1,
        disabled: isUploading
    })

    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{ required: 'A video is required' }}
            render={({ field, fieldState: { error } }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant='h6'>{label}</Typography>

                    {/* Preview Area */}
                    {previewVideo || field.value ? (
                        <video
                            src={previewVideo || field.value}
                            controls
                            style={{ width: '100%', maxWidth: 400, borderRadius: 8, border: '1px solid #ccc' }}
                        />
                    ) : (
                        <Typography variant='body2' color='textSecondary'>
                            No video selected
                        </Typography>
                    )}

                    {/* Dropzone */}
                    <Box
                        {...getRootProps()}

                    >
                        <input {...getInputProps()} />
                        {isUploading ? (

                            <Loading />) : (
                            <Box 
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
                                    }}>
                                <IconCloudUpload size={32} style={{ marginBottom: 8 }} />
                                <Typography>
                                    {isDragActive ? 'Drop the video here' : 'Drag & drop a video here, or click to select'}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
                                    Only MP4, MOV, WEBM files are accepted
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Error Message */}
                    {error && (
                        <Typography variant='body2' color='error'>
                            {error.message}
                        </Typography>
                    )}

                    {/* Remove Button */}
                    {/* {(previewVideo || field.value) && (
                        <Button
                            variant='outlined'
                            color='error'
                            onClick={(e) => {
                                e.stopPropagation()
                                setPreviewVideo(null)
                                field.onChange(undefined)
                                setValue(fieldName, undefined, { shouldValidate: true })
                            }}
                            disabled={isUploading}
                        >
                            Remove Video
                        </Button>
                    )} */}
                </Box>
            )}
        />
    )
}

export default VideoUploadField
