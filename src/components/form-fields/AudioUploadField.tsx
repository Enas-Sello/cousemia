'use client';

import React, { useCallback, useState } from 'react';

import { Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IconCloudUpload } from '@tabler/icons-react';

import Loading from '../loading';
import type { AudioFieldProps } from '@/types/audioType';
import { uploadAudio } from '@/data/media/mediaQuery';

const AudioUploadField: React.FC<AudioFieldProps> = ({
    control,
    fieldName,
    setValue,
    initialAudioUrl,
    label = 'Upload Audio',
    route
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const uploadAudioMutation = useMutation({
        mutationFn: (file: File) => uploadAudio(file, route),
        onMutate: () => setIsUploading(true),
        onSuccess: (data: string) => {
            console.log('Audio uploaded successfully:', data);
            setValue(fieldName, data, { shouldValidate: true });
            toast.success('Audio uploaded successfully');
        },
        onError: () => {
            toast.error('Failed to upload audio. Please try again.');
            setFileName(null);
            setValue(fieldName, undefined, { shouldValidate: true });
        },
        onSettled: () => setIsUploading(false)
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (!file) return;

        setFileName(file.name);
        uploadAudioMutation.mutate(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'audio/*': [] },
        multiple: false,
        disabled: isUploading
    });

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ fieldState: { error } }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant='h6'>{label}</Typography>

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
                                    {isDragActive
                                        ? 'Drop the audio file here'
                                        : fileName || initialAudioUrl
                                            ? fileName || 'Audio file selected'
                                            : 'Drag & drop an audio file here, or click to select'}
                                </Typography>
                                {initialAudioUrl && !fileName && (
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Current audio: {''}
                                            {typeof initialAudioUrl === 'string' ? initialAudioUrl : initialAudioUrl.name}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>

                    {/* Error message */}
                    {error && (
                        <Typography variant='body2' color='error'>
                            {error.message}
                        </Typography>
                    )}
                </Box>
            )}
        />
    );
};

export default AudioUploadField;
