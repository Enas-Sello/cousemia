'use client';

import { Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';

// interface AudioUploadFieldProps {
//     control: any;
//     fieldName: string;
//     fieldId: string;
//     setValue: (name: string, value: any) => void;
//     initialAudioUrl?: string | null;
//     label?: string;
// }

const AudioUploadField: React.FC<any> = ({ control, fieldId, setValue, label = 'Upload Audio' }) => {

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'audio/*': [] }, // Accept all audio files
        multiple: false, // Allow only one file at a time
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                const file = acceptedFiles[0];

                setValue(fieldId, file); // Update the form with the selected file
            }
        },
    });

    return (
        <Controller
            name={fieldId}
            control={control}
            render={({ field, fieldState }) => {
                return (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>{label}</Typography>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed #ccc',
                                padding: 2,
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <input {...getInputProps()} />
                            {field.value ? (
                                <Typography variant="body2">{field.value.name}</Typography> // Show the selected file name
                            ) : (
                                <Typography variant="body2">Click or drag audio file here</Typography> // Default text when no file is selected
                            )}
                        </Box>
                        {fieldState?.error && (
                            <Typography color="error" variant="caption">
                                {fieldState.error.message}
                            </Typography>
                        )}
                    </Box>
                );
            }}
        />
    );
};

export default AudioUploadField;
