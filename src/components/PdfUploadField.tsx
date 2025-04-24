// components/PdfUploadField.tsx
import React, { useCallback } from "react";

import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { Box, Typography } from "@mui/material";

type Props = {
    control: any;
    name: string;
    setValue: (name: string, value: any) => void;
    handleUpload: (file: File, type: "pdf") => Promise<{ url: string }>;
};

const PdfUploadField = ({ control, name, setValue, handleUpload }: Props) => {
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            if (file) {
                const { url } = await handleUpload(file, "pdf");

                setValue(name, url);
            }
        },
        [handleUpload, setValue, name]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
    });

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Box>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: "2px dashed #ccc",
                            padding: "1rem",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography>
                            {field.value ? "تم رفع الملف" : "اضغط أو اسحب ملف PDF"}
                        </Typography>
                    </Box>
                    {field.value && (
                        <Typography mt={1} color="primary">
                            ملف PDF تم رفعه: {field.value}
                        </Typography>
                    )}
                </Box>
            )}
        />
    );
};

export default PdfUploadField;
