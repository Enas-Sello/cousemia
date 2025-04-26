import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { Box, Typography, CircularProgress } from "@mui/material";

import { uploadPDF } from "@/data/media/mediaQuery";

type Props<T extends Record<string, any>> = {
    control: any;
    name: keyof T;
    setValue: <K extends keyof T>(name: K, value: T[K]) => void;
    route: string;
};

const PdfUploadField = <T extends Record<string, any>>({
    control,
    name,
    setValue,
    route
}: Props<T>) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            if (!file) return;

            setUploading(true);
            setError(null);

            try {
                const fileUrl = await uploadPDF(file, route);

                setValue(name, fileUrl as T[typeof name]);
            } catch (err) {
                console.error("PDF upload failed:", err);
                setError("Failed to upload PDF. Please try again.");
            } finally {
                setUploading(false);
            }
        },
        [name, setValue, route]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        disabled: uploading,
    });

    return (
        <Controller
            control={control}
            name={name as string}
            render={({ field }) => (
                <Box>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: "2px dashed #ccc",
                            padding: "1rem",
                            textAlign: "center",
                            cursor: uploading ? "wait" : "pointer",
                            opacity: uploading ? 0.7 : 1,
                        }}
                    >
                        <input {...getInputProps()} />
                        {uploading ? (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <CircularProgress size={24} />
                                <Typography sx={{ mt: 1 }}>Uploading PDF...</Typography>
                            </Box>
                        ) : (
                            <Typography>
                                {field.value ? "File uploaded" : "Click or drag PDF file here"}
                            </Typography>
                        )}
                    </Box>

                    {field.value && (
                        <Typography mt={1} color="primary">
                            PDF file uploaded: {field.value}
                        </Typography>
                    )}

                    {error && (
                        <Typography mt={1} color="error">
                            {error}
                        </Typography>
                    )}
                </Box>
            )}
        />
    );
};

export default PdfUploadField;
