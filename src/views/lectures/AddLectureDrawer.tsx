'use client'
import { useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'
import { Drawer, IconButton, Typography, Divider, Button, Box } from '@mui/material'

import { useMutation } from '@tanstack/react-query'

import CustomTextField, { CustomTextFieldRadio } from '@core/components/mui/TextField'
import { addNewLecture } from '@/data/lectures/lecturesQuery'
import type { LectureProps, NewLectureFormData } from '@/types/lectureType'
import { LectureFormSchema } from '@/schema/LectureSchema/LectureFormSchema'
import FiltersDataInput from '@/components/FiltersDataInput'
import BasicFields from '@/components/BasicFields'
import Loading from '@/components/loading'
import ImageUploadField from '@/components/ImageUploadField'
import VideoTypeField from '@/components/VideoTypeField'
import VideoInputField from '@/components/VideoInputField'
import { getFieldError } from '@/utils/forms'




const AddLectureDrawer = ({ open, handleClose }: LectureProps) => {

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewLectureFormData>({
    resolver: valibotResolver(LectureFormSchema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      video_type: 'url',
      course_id: 0,
      category_id: 0,
      sub_category_id: 0,
      is_free_content: '',
      video_thumb: null,
      image_src: '',
      path: '',
      video: null,
    }

  })

  const videoType = watch('video_type')
  const videoThumbUrl = watch('image_src')

  console.log('videoThumbUrl', videoThumbUrl)



  // add new lecture mutation
  const { mutate: newLecture, isPending: pendingNewLecture } = useMutation({
    mutationFn: (data: FormData) => addNewLecture(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Lecture added successfully');
      reset();
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add lecture');
    },
  });


  // Handle form submission
  const onSubmit = (data: NewLectureFormData) => {
    console.log("Form data before submission:", data);
    console.log("path:", data.path);

    // Handle potential errors by scrolling to the first error field (if any)
    if (Object.keys(errors).length) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Prepare the payload object for submission
    const payload = {
      title_en: data.title_en,
      title_ar: data.title_ar,
      description_en: data.description_en,
      description_ar: data.description_ar,
      is_free_content: data.is_free_content,
      course_id: data.course_id.toString(),
      category_id: data.category_id.toString(),
      sub_category_id: data.sub_category_id.toString(),
      video_type: data.video_type,
      video_thumb: data.video_thumb || null, // Optional: append if exists
      image_src: data.image_src || '', // Assuming video_thumb_url is the image URL
      path: data.path, // Use video URL path if video type is URL
      video: data.video || null, // Only append video if available
      file: {
        "$path": data.video ? '' : '', // Adjust based on whether you want a specific file path for uploads
      }
    } as unknown as FormData;

    // If video type is 'upload', you might need to handle form data differently to accommodate the video file
    if (data.video_type === 'upload' && data.video) {
      // Prepare FormData if you're using file uploads
      const formData = new FormData();

      formData.append('title_en', data.title_en);
      formData.append('title_ar', data.title_ar);
      formData.append('description_en', data.description_en);
      formData.append('description_ar', data.description_ar);
      formData.append('course_id', data.course_id.toString());
      formData.append('category_id', data.category_id.toString());
      if (data.sub_category_id) formData.append('sub_category_id', data.sub_category_id.toString());
      formData.append('image_src', data.image_src);
      formData.append('video_type', data.video_type);
      formData.append('video', data.video);
      formData.append('file.$path', data.path);
      if (data.video_thumb) formData.append('video_thumb', data.video_thumb);

      // Send to mutation
      newLecture(formData);
    } else {
      // Directly send the data if video type is 'url' without the FormData
      newLecture(payload);
    }

    console.log("Form data after submission:", payload);
  };



  // Handle reset
  const handleReset = () => {
    reset()
    handleClose()
  }

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Box className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New Lecture</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </Box>
      <Divider />
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 6 }}
      >

        <BasicFields control={control} errors={errors} description />

        {/* Video Type */}
        <VideoTypeField control={control} errors={errors} />

        {/* Video Upload Section */}
        {videoType === 'upload' && (
          <VideoInputField
            control={control}
            fieldName="file.path"
            fieldId="video"
            setValue={setValue}
            initialVideoUrl=""
          />
        )}

        {videoType === 'url' && (
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label="Lecture Video URL"
                error={!!errors.path}
                helperText={errors.path?.message}
              />
            )}
          />
        )}
        {/* Thumbnail Upload Section */}

        <ImageUploadField
          control={control}
          fieldName='image_src'
          fieldId='video_thumb'
          initialImageUrl={videoThumbUrl || null}
          setValue={setValue}
          label='Cover Image'
        />
        <FiltersDataInput
          courseId={watch('course_id')}
          categoryId={watch('category_id')}
          subCategoryId={watch('sub_category_id')}
          setCourseId={(id) => setValue('course_id', id ?? 0)}
          setCategoryId={(id) => setValue('category_id', id ?? 0)}
          setSubCategoryId={(id) => setValue('sub_category_id', id ?? 0)}
          drawer
        />
        {/* Is Free Content */}
        <Controller
          name='is_free_content'
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <CustomTextFieldRadio
              {...field}
              label='Is Free?'
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' }
              ]}
              value={field.value ?? ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(event.target.value)
              }}
              {...getFieldError(errors, 'is_free_content')}

            />
          )}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained' type='submit' sx={{ flex: 1 }}
            disabled={pendingNewLecture}>
            {pendingNewLecture ? (
              <>
                <Loading />
              </>
            ) : (
              'Submit'
            )}          </Button>
          <Button variant='tonal' color='error' type='reset' onClick={handleReset} sx={{ flex: 1 }}>
            Cancel
          </Button>
        </Box>

        {/* Error Message */}
        {errors.root && (
          <Typography color='error' variant='body2'>
            {errors.root.message}
          </Typography>
        )}
      </Box>
    </Drawer>
  )
}

export default AddLectureDrawer
