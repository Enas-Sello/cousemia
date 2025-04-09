import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'

const VideoTypeField: React.FC<{
  control: any
  errors: any
}> = ({ control, errors }) => {
  const videoTypes = ['Upload video', 'Insert a URL']

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name='video_type'
        control={control}
        rules={{ required: 'Video type is required' }}
        render={({ field }) => (
          <CustomAutocomplete
            {...field}
            options={videoTypes}
            value={field.value || null}
            getOptionLabel={(option: string) => option}
            onChange={(event, value) => field.onChange(value || '')}
            renderInput={params => (
              <CustomTextField
                {...params}
                label='Select Video Type'
                error={!!errors.video_type}
                helperText={errors.video_type?.message}
              />
            )}
          />
        )}
      />
    </Grid>
  )
}
export default VideoTypeField
