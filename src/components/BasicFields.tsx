import Grid from '@mui/material/Grid2'
import { Controller } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'

const BasicFields: React.FC<{
  control: any
  errors: any
  description?: boolean 
}> = ({ control, errors, description }) => (
  <>
    {/* Title EN */}
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name='title_en'
        control={control}
        rules={{ required: 'Title (English) is required' }}
        render={({ field }) => (
          <CustomTextField
            {...field}
            fullWidth
            label='Title EN'
            error={!!errors.title_en}
            helperText={errors.title_en?.message}
          />
        )}
      />
    </Grid>

    {/* Title AR */}
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name='title_ar'
        control={control}
        render={({ field }) => (
          <CustomTextField
            {...field}
            fullWidth
            label='Title AR'
            error={!!errors.title_ar}
            helperText={errors.title_ar?.message}
          />
        )}
      />
    </Grid>
    {description &&
      <>
      {/* English Description */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name='description_en'
          control={control}
          rules={{ required: 'Description (English) is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              rows={4}
              multiline
              label='English Description'
              error={!!errors.description_en}
              helperText={errors.description_en?.message}
            />
          )}
        />
      </Grid>

      {/* Arabic Description */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name='description_ar'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              rows={4}
              multiline
              label='Arabic Description'
              error={!!errors.description_ar}
              helperText={errors.description_ar?.message}
            />
          )}
        />
      </Grid>
      </>}
  
  </>
)

export default BasicFields
