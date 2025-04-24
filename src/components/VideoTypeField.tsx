import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid2'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';
import videoTypes from '@/constants/videoTypes';
import { getFieldError } from '@/utils/forms';

const VideoTypeField: React.FC<{
  control: any;
  errors: any;
}> = ({ control, errors }) => {

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
            value={videoTypes.find(option => option.value === field.value) || null}
            onChange={(event, newValue) => field.onChange(newValue?.value || 'url')}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Select Video Type"
                {...getFieldError(errors, 'video_type')}
              
              />
            )}
          />
        )}
      />
    </Grid >
  );
};

export default VideoTypeField;
