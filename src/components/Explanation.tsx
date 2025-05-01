import Grid from '@mui/material/Grid2'
import type { UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form'

import { Typography } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import ImageUploadField from './form-fields/ImageUploadField'

const Explanation = ({ control, setValue, explanationImageUrl }: {
    control: any
    setValue: UseFormSetValue<any> 
    explanationImageUrl: string | null | undefined |File
}) => {
    return (
        <>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    name="explanation_en"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                            {...field}
                            label="English Explanation"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    name="explanation_ar"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                            {...field}
                            label="Arabic Explanation"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
            </Grid>

            {/* Explanation Image */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Typography>Explanation Image</Typography>
                <ImageUploadField
                    control={control}
                    fieldName="explanation_image"
                    fieldId="explanation_image_id"
                    initialImageUrl={
                        typeof explanationImageUrl === 'string' ? explanationImageUrl : null
                    }
                    setValue={setValue}
                    label=""
                />
            </Grid>

        </>
    )
}

export default Explanation
