'use client'
import { useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'
import { Drawer, IconButton, Typography, Divider, Button, Box } from '@mui/material'

import { useMutation } from '@tanstack/react-query'

import { CustomTextFieldRadio } from '@core/components/mui/TextField'
import { uploadLectureImage, uploadLectureVideo, addNewLecture } from '@/data/lectures/lecturesQuery'
import type { LectureProps, NewLectureFormData } from '@/types/lectureType'
import { LectureFormSchema } from '@/schema/LectureSchema/LectureFormSchema'
import FiltersDataInput from '@/components/FiltersDataInput'
import BasicFields from '@/components/BasicFields'
import Loading from '@/components/loading'
import ImageUploadField from '@/components/ImageUploadField'
import VideoTypeField from '@/components/VideoTypeField'
import VideoInputField from '@/components/VideoInputField'




const AddLectureDrawer = ({ open, handleClose }: LectureProps) => {

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError
  } = useForm<NewLectureFormData>({
    resolver: valibotResolver(LectureFormSchema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      video_type: '',
      video_url: '',
      course_id: 0,
      category_id: 0,
      sub_category_id: 0,
      is_free_content: '',
      video_thumb: null,
      video_thumb_url: '',
      video: null,
    }

  })

  const videoType = watch('video_type')
  const videoThumbUrl = watch('video_thumb_url')


  // File upload mutations
  const { mutate: uploadImage, isPending: imageUploading } = useMutation({
    mutationFn: (formData: FormData) => uploadLectureImage(formData),
    onSuccess: (data) => {
      setValue('video_thumb_url', data.url);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to upload thumbnail');
    },
  });

  const { mutate: uploadVideo, isPending: videoUploading } = useMutation({
    mutationFn: (formData: FormData) => uploadLectureVideo(formData),
    onSuccess: (data) => {
      setValue('video_url', data.url);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to upload video');
    },
  });

  // Handle file upload (thumbnail or video)
  const handleUpload = (file: File, type: 'video' | 'image') => {
    const formData = new FormData();

    if (type === 'image') {
      formData.append('name', 'video-thumbnail');
      formData.append('media', file);
      uploadImage(formData);
    } else if (type === 'video') {
      formData.append('file', file);
      uploadVideo(formData);
    }

    return Promise.resolve({ url: '' }); // إذا MediaUploader يعتمد على promise
  };

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

    // Additional validation
    if (videoType === 'upload' && !data.video) {
      setError('video', { message: 'Video file is required' });

      return;
    }

    if (!data.video_thumb_url) {
      setError('video_thumb', { message: 'Thumbnail is required' });

      return;
    }

    if (Object.keys(errors).length) {
      const firstErrorField = Object.keys(errors)[0]
      const el = document.querySelector(`[name="${firstErrorField}"]`);

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Prepare FormData
    const formData = new FormData();

    formData.append('title_en', data.title_en);
    if (data.title_ar) formData.append('title_ar', data.title_ar);
    formData.append('description_en', data.description_en);
    if (data.description_ar) formData.append('description_ar', data.description_ar);
    formData.append('video_type', data.video_type);
    formData.append('video_url', data.video_url);
    formData.append('course_id', data.course_id.toString());
    formData.append('category_id', data.category_id.toString());
    if (data.sub_category_id) formData.append('sub_category_id', data.sub_category_id.toString());
    formData.append('is_free_content', data.is_free_content);
    formData.append('video_thumb_url', data.video_thumb_url);

    if (data.video) formData.append('video', data.video);
    if (data.video_thumb) formData.append('video_thumb', data.video_thumb);

    newLecture(formData);
  };


  // Handle reset
  const handleReset = () => {
    reset()
    handleClose()
  }

  useEffect(() => {
    console.log(errors);
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

        <BasicFields control={control} errors={errors} />

        {/* Video Type */}
        <VideoTypeField control={control} errors={errors} />

        {/* Video Upload Section */}
        <VideoInputField
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          handleUpload={handleUpload}
        />

        {/* Thumbnail Upload Section */}

        <ImageUploadField
          control={control}
          fieldName='image'
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
              error={!!errors.is_free_content}
              helperText={errors.is_free_content?.message}
            />
          )}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained' type='submit' sx={{ flex: 1 }}
            disabled={pendingNewLecture || videoUploading || imageUploading}>
            {pendingNewLecture ? (
              <>
                <Loading />                  Submitting...
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
