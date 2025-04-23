import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField';
import MediaUploader from '@/components/MediaUploader';

const VideoInputField: React.FC<{
    control: any;
    errors: any;
    watch: any;
    setValue: any;
    handleUpload: (file: File, type: 'video' | 'pdf') => Promise<void>;
}> = ({ control, errors, watch, setValue, handleUpload }) => {
    const videoType = watch('video_type');

    return (
        <Grid size={{ xs: 12 }}>
            {videoType === 'upload' ? (
                <Controller
                    name="video"
                    control={control}
                    render={({ field }) => (
                        <MediaUploader
                            label="Upload Lecture Video"
                            mediaType="video"
                            onUpload={(file) => {
                                field.onChange(file);
                                handleUpload(file, 'video');

                                return Promise.resolve({ url: '' });
                            }}
                            value={field.value}
                            onChange={(url) => {
                                setValue('video_url', url || '');
                                if (!url) field.onChange(null);
                            }}
                            error={errors.video?.message}
                            maxSize={209715200}
                        />
                    )}
                />
            ) : (
                <Controller
                    name="video_url"
                    control={control}
                    render={({ field }) => (
                        <CustomTextField
                            {...field}
                            fullWidth
                            label="Lecture Video URL"
                            error={!!errors.video_url}
                            helperText={errors.video_url?.message}
                        />
                    )}
                />
            )}
        </Grid>
    );
};

export default VideoInputField;
