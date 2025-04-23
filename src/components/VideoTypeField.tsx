import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid2'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';

const VideoTypeField: React.FC<{
  control: any;
  errors: any;
}> = ({ control, errors }) => {
  const videoTypes = [
    { label: 'Upload video', value: 'upload' },
    { label: 'Insert a URL', value: 'url' },
  ];

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name="video_type"
        control={control}
        rules={{ required: 'Video type is required' }}
        render={({ field }) => (
          <CustomAutocomplete
            {...field}
            options={videoTypes}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => field.onChange(newValue?.value || '')}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Select Video Type"
                error={!!errors.video_type}
                helperText={errors.video_type?.message}
              />
            )}
          />
        )}
      />
    </Grid >
  );
};

export default VideoTypeField;
