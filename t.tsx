import type { ChangeEvent } from 'react'
import React, { useEffect, useState } from 'react'

import { useDropzone } from 'react-dropzone'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, number, url, minValue } from 'valibot'
import type { Input } from 'valibot'

import { toast } from 'react-toastify'

import CustomTextField, { CustomTextFieldRadio } from '@core/components/mui/TextField'
import { getCourseList } from '@/data/courses/getCourses'
import { getCategoriesByCourseID, getSubCategoryList } from '@/data/categories/getCategories'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { uploadLectureImage, uploadLectureVideo, storeLecture } from '@/data/courses/getLectures'

type Props = {
  open: boolean
  handleClose: () => void
}

type FormDataType = {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  is_free_content: string
  video_thumb: string
  course_id: number
  category_id: number
  sub_category_id: number
  video: null
  path: string
  file: {
    $path: string
  }
  image_src: string
  video_type: string
}

// Vars
const initialData = {
  video_type: '',
  path: '',
  course_id: '',
  category_id: '',
  sub_category_id: '',
  is_free_content: '',
  video_thumb: '',
  image_src: ''
}

type FormData = Input<typeof schema>

const schema = object({
  title_en: string([minLength(1, 'This field is required')]),
  title_ar: string(),
  description_en: string([minLength(1, 'This field is required')]),
  description_ar: string(),
  video_type: string([minLength(1, 'This field is required')]),
  path: string([minLength(1, 'This field is required'), url('Please enter a valid URL')]),
  course_id: number([minValue(1, 'This field is required')]),
  category_id: number([minValue(1, 'This field is required')]),
  sub_category_id: number([minValue(1, 'This field is required')]),
  is_free_content: string([minLength(1, 'This field is required')])

  // video_thumb: string([minLength(1, 'This field is required')])
})

const AddLectureDrawer = ({ open, handleClose }: Props) => {
  const [formData, setFormData] = useState<FormDataType>(initialData)

  const [videoTypeOptions, setVideoTypeOptions] = useState([
    { value: 'upload', label: 'Upload video' },
    { value: 'url', label: 'Insert a URL' }
  ])

  const [courseOptions, setCourseOptions] = useState([])
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const [videoUploading, setVideoUploading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      video_type: '',
      path: '',
      course_id: 0,
      category_id: 0,
      sub_category_id: 0,
      is_free_content: '',
      video_thumb: ''
    }
  })

  // Handle file upload (thumbnail or video)
  const onDrop = async (acceptedFiles: File[], type: string) => {
    const file = acceptedFiles[0]

    if (file) {
      if (type === 'path') {
        setVideoUploading(true)
        const data = new FormData()

        data.append('file', file)

        try {
          const uploadResponse = await uploadLectureVideo(data)

          const videoUrl = uploadResponse.url

          setFormData(prev => ({
            ...prev,
            path: videoUrl
          }))
        } catch (error) {
          console.error('Error during video upload:', error)
        } finally {
          setVideoUploading(false)
        }
      } else if (type === 'video_thumb') {
        setImageUploading(true)
        const data = new FormData()

        data.append('name', 'my-picture')
        data.append('media', file)

        try {
          const uploadResponse = await uploadLectureImage(data)

          setFormData(prev => ({
            ...prev,
            video_thumb: uploadResponse.id,
            image_src: uploadResponse.url
          }))
        } catch (error) {
          console.error('Error during image upload:', error)
        } finally {
          setImageUploading(false)
        }
      } else {
        const reader = new FileReader()

        reader.onload = () => {
          setFormData(prevData => ({ ...prevData, [type]: reader.result as string }))
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const dropzoneThumbnail = useDropzone({
    accept: { 'image/*': [] }, // Only accept image files
    maxSize: 2097152, // Limit to 2 MB
    onDrop: files => onDrop(files, 'video_thumb')
  })

  const dropzoneVideo = useDropzone({
    accept: { 'video/*': [] }, // Only accept video files
    maxSize: 209715200,
    onDrop: files => onDrop(files, 'path')
  })

  const handleReset = () => {
    handleClose()
    reset()
  }

  // Fetch course list
  const fetchCourseList = async () => {
    const result = await getCourseList()
    const { data } = result

    const options = data.map((course: any) => ({ value: course.id, label: course.title_en }))

    setCourseOptions(options)
  }

  // Fetch categories based on course selection
  const fetchCategoryList = async (course_id: number) => {
    const result = await getCategoriesByCourseID(course_id)
    const { data } = result

    const options = data.map((category: any) => ({ value: category.value, label: category.label }))

    setCategoriesOptions(options)
  }

  // Fetch sub-categories based on category and course selection
  const fetchSubCategoryList = async (course_id: number, category_id: number) => {
    const result = await getSubCategoryList(course_id, category_id)
    const { data } = result

    const options = data.map((subCategory: any) => ({ value: subCategory.value, label: subCategory.label }))

    setSubCategoryOptions(options)
  }

  useEffect(() => {
    if (formData.course_id) {
      fetchCategoryList(parseInt(formData.course_id))
    }
  }, [formData.course_id])

  useEffect(() => {
    if (formData.course_id && formData.category_id) {
      fetchSubCategoryList(parseInt(formData.course_id), parseInt(formData.category_id))
    }
  }, [formData.category_id, formData.course_id])

  useEffect(() => {
    fetchCourseList()
  }, [])

  const onSubmit = async (data: FormDataType) => {
    try {
      const finalData = {
        title_en: data.title_en,
        title_ar: data.title_ar,
        description_en: data.description_en,
        description_ar: data.description_ar,
        is_free_content: data.is_free_content,
        video_thumb: formData.video_thumb,
        course_id: data.course_id,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        video: null,
        path: data.path,
        file: {
          $path: ''
        },
        image_src: formData.image_src,
        video_type: data.video_type
      }

      const uploadResponse = await storeLecture(finalData)

      toast.success(`${uploadResponse.message}`)
      reset()
      handleClose()
    } catch (error) {
      console.error('Error during lecture store:', error)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New Lecture</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <Controller
            name='title_en'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='English Title'
                {...(errors.title_en && { error: true, helperText: errors.title_en.message })}
              />
            )}
          />

          <Controller
            name='title_ar'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Arabic Title'
                {...(errors.title_ar && { error: true, helperText: errors.title_ar.message })}
              />
            )}
          />

          <Controller
            name='description_en'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                rows={2}
                multiline
                fullWidth
                label='English Description'
                {...(errors.description_en && { error: true, helperText: errors.description_en.message })}
              />
            )}
          />

          <Controller
            name='description_ar'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                rows={2}
                multiline
                fullWidth
                label='Arabic Description'
                {...(errors.description_ar && { error: true, helperText: errors.description_ar.message })}
              />
            )}
          />

          <Controller
            name='video_type'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                fullWidth
                options={videoTypeOptions}
                getOptionLabel={(option: any) => option.label || ''}
                value={videoTypeOptions.find((option: any) => option.value === field.value) || 0}
                onChange={(event, newValue) => {
                  field.onChange(newValue ? newValue.value : '')
                  setFormData(prev => ({ ...prev, video_type: newValue ? newValue.value : '' }))
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Select Video Type'
                    fullWidth
                    {...(errors.video_type && { error: true, helperText: errors.video_type.message })}
                  />
                )}
              />
            )}
          />

          {/* Video Upload Section */}
          {formData.video_type === 'upload' && (
            <div className='mui-rwmgte-MuiFormControl-root-MuiTextField-root'>
              <label className='MuiInputLabel-root'>Upload Lecture Video</label>
              <div {...dropzoneVideo.getRootProps({ className: 'dropzone' })} className='border-2 border-dashed p-4'>
                <input {...dropzoneVideo.getInputProps()} />
                {dropzoneVideo.isDragActive ? (
                  <p>Drop the video here...</p>
                ) : (
                  <p>Drag & drop a video file here, or click to select one (max 50MB)</p>
                )}
              </div>
              {videoUploading ? (
                <p className='mt-2 text-blue-600'>Uploading video...</p>
              ) : (
                formData.path && <p className='mt-2'>Uploaded Video URL: {formData.path}</p>
              )}
            </div>
          )}

          <Controller
            name='path'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Select Lecture Video'
                {...(errors.path && { error: true, helperText: errors.path.message })}
              />
            )}
          />

          {/* Thumbnail Upload Section */}
          <div className='mui-rwmgte-MuiFormControl-root-MuiTextField-root'>
            <label className='MuiInputLabel-root'>Video Thumbnail</label>
            <div {...dropzoneThumbnail.getRootProps({ className: 'dropzone' })} className='border-2 border-dashed p-4'>
              <input {...dropzoneThumbnail.getInputProps()} />
              {dropzoneThumbnail.isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag & drop a thumbnail image here, or click to select one (max 2MB)</p>
              )}
              {dropzoneThumbnail.fileRejections.length > 0 && (
                <p className='text-red-500'>File size exceeds 2MB or wrong format</p>
              )}
            </div>
          </div>

          {imageUploading ? (
            <p className='mt-2 text-blue-600'>Uploading video thumbnail...</p>
          ) : (
            formData.video_thumb && (
              <img
                src={formData.image_src}
                alt='Video Thumbnail'
                className='mt-4'
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
              />
            )
          )}

          <Controller
            name='course_id'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                fullWidth
                options={courseOptions}
                getOptionLabel={(option: any) => option.label || ''}
                value={courseOptions.find((option: any) => option.value === field.value) || 0}
                onChange={(event, newValue) => {
                  field.onChange(newValue ? newValue.value : 0)
                  setFormData(prev => ({ ...prev, course_id: newValue ? newValue.value : '' }))
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Choose Course'
                    fullWidth
                    {...(errors.course_id && { error: true, helperText: errors.course_id.message })}
                  />
                )}
              />
            )}
          />

          {formData.course_id && (
            <Controller
              name='category_id'
              control={control}
              render={({ field }) => (
                <CustomAutocomplete
                  {...field}
                  fullWidth
                  options={categoriesOptions}
                  getOptionLabel={(option: any) => option.label || ''}
                  value={categoriesOptions.find((option: any) => option.value === field.value) || 0}
                  onChange={(event, newValue) => {
                    field.onChange(newValue ? newValue.value : 0)
                    setFormData(prev => ({ ...prev, category_id: newValue ? newValue.value : '' }))
                  }}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label='Choose Category'
                      fullWidth
                      {...(errors.category_id && { error: true, helperText: errors.category_id.message })}
                    />
                  )}
                />
              )}
            />
          )}

          {formData.course_id && formData.category_id && (
            <Controller
              name='sub_category_id'
              control={control}
              render={({ field }) => (
                <CustomAutocomplete
                  {...field}
                  fullWidth
                  options={subCategoryOptions}
                  getOptionLabel={(option: any) => option.label || ''}
                  value={subCategoryOptions.find((option: any) => option.value === field.value) || 0}
                  onChange={(event, newValue) => {
                    field.onChange(newValue ? newValue.value : 0)
                    setFormData(prev => ({ ...prev, sub_category_id: newValue ? newValue.value : '' }))
                  }}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label='Choose Sub-category'
                      fullWidth
                      {...(errors.sub_category_id && { error: true, helperText: errors.sub_category_id.message })}
                    />
                  )}
                />
              )}
            />
          )}

          <Controller
            name='is_free_content'
            control={control}
            rules={{ required: 'This field is required' }} // Set required validation rule here
            render={({ field }) => (
              <CustomTextFieldRadio
                {...field}
                label='Is Free?'
                options={[
                  { value: '1', label: 'Yes' },
                  { value: '0', label: 'No' }
                ]}
                value={field.value ?? ''} // Ensure it's not undefined, could be null or empty string
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(event.target.value) // Extract value from the event
                }}
                {...(errors.is_free_content && { error: true, helperText: errors.is_free_content.message })}
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => reset()}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddLectureDrawer


//old


'use client'
import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, number, url, minValue } from 'valibot'
import { toast } from 'react-toastify'
import { Drawer, IconButton, Typography, Divider, Button, Box } from '@mui/material'

import CustomTextField, { CustomTextFieldRadio } from '@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import MediaUploader from '@/components/MediaUploader' // Adjust path as needed
import { getCourseList } from '@/data/courses/getCourses'
import { getCategoriesByCourseID, getSubCategoryList } from '@/data/categories/getCategories'
import { uploadLectureImage, uploadLectureVideo, storeLecture } from '@/data/courses/getLectures'

// Props type
type Props = {
  open: boolean
  handleClose: () => void
}

// Option type for dropdowns
type Option = {
  value: string | number
  label: string
}

// Form data type
type FormDataType = {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  is_free_content: string
  video_thumb: File | null // File for thumbnail
  video_thumb_url: string // URL for thumbnail preview
  course_id: number
  category_id: number
  sub_category_id: number
  video: File | null // File for video
  video_url: string // URL for video preview
  video_type: string
}

// Valibot schema for validation
const schema = object({
  title_en: string([minLength(1, 'This field is required')]),
  title_ar: string(),
  description_en: string([minLength(1, 'This field is required')]),
  description_ar: string(),
  video_type: string([minLength(1, 'This field is required')]),
  video_url: string([minLength(1, 'This field is required'), url('Please enter a valid URL')]),
  course_id: number([minValue(1, 'This field is required')]),
  category_id: number([minValue(1, 'This field is required')]),
  sub_category_id: number([minValue(1, 'This field is required')]),
  is_free_content: string([minLength(1, 'This field is required')])
})

const AddLectureDrawer = ({ open, handleClose }: Props) => {
  const [videoTypeOptions] = useState<Option[]>([
    { value: 'upload', label: 'Upload video' },
    { value: 'url', label: 'Insert a URL' }
  ])

  const [courseOptions, setCourseOptions] = useState<Option[]>([])
  const [categoriesOptions, setCategoriesOptions] = useState<Option[]>([])
  const [subCategoryOptions, setSubCategoryOptions] = useState<Option[]>([])

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm<FormDataType>({
    resolver: valibotResolver(schema),
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
      video_url: ''
    }
  })

  const videoType = watch('video_type')
  const courseId = watch('course_id')
  const categoryId = watch('category_id')
  const videoThumbUrl = watch('video_thumb_url')
  const videoUrl = watch('video_url')

  // Fetch course list
  const fetchCourseList = async () => {
    const result = await getCourseList()

    const options = result.data.map((course: any) => ({
      value: course.id,
      label: course.title_en
    }))

    setCourseOptions(options)
  }

  // Fetch categories based on course selection
  const fetchCategoryList = async (course_id: number) => {
    if (course_id) {
      const result = await getCategoriesByCourseID(course_id)

      const options = result.data.map((category: any) => ({
        value: category.value,
        label: category.label
      }))

      setCategoriesOptions(options)
    }
  }

  // Fetch sub-categories based on category and course selection
  const fetchSubCategoryList = async (course_id: number, category_id: number) => {
    if (course_id && category_id) {
      const result = await getSubCategoryList(course_id, category_id)

      const options = result.data.map((subCategory: any) => ({
        value: subCategory.value,
        label: subCategory.label
      }))

      setSubCategoryOptions(options)
    }
  }

  useEffect(() => {
    fetchCourseList()
  }, [])

  useEffect(() => {
    fetchCategoryList(courseId)
  }, [courseId])

  useEffect(() => {
    fetchSubCategoryList(courseId, categoryId)
  }, [courseId, categoryId])

  // Handle file upload (thumbnail or video)
  const handleUpload = async (file: File, type: 'image' | 'video') => {
    const data = new FormData()

    if (type === 'image') {
      data.append('name', 'my-picture')
      data.append('media', file)

      return uploadLectureImage(data)
    } else {
      data.append('file', file)

      return uploadLectureVideo(data)
    }
  }

  // Handle form submission
  const onSubmit = async (data: FormDataType) => {
    console.log('datadata', data)

    try {
      if (videoType === 'upload' && !data.video) {
        setError('video', { message: 'Video file is required' })

        return
      }

      if (!data.video_thumb) {
        setError('video_thumb', { message: 'Thumbnail image is required' })

        return
      }

      const finalData = {
        title_en: data.title_en,
        title_ar: data.title_ar,
        description_en: data.description_en,
        description_ar: data.description_ar,
        is_free_content: data.is_free_content,
        video_thumb: data.video_thumb_url, // Use the uploaded URL
        course_id: data.course_id,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        video: null,
        path: data.video_url,
        file: { $path: '' },
        image_src: data.video_thumb_url,
        video_type: data.video_type
      }

      console.log('finalData', finalData)
      const uploadResponse = await storeLecture(finalData)

      toast.success(`${uploadResponse.message}`)
      reset()
      handleClose()
    } catch (error: any) {
      setError('root', { message: error.message || 'Error during lecture store' })
    }
  }

  // Handle reset
  const handleReset = () => {
    reset()
    handleClose()
  }

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
        {/* English Title */}
        <Controller
          name='title_en'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='English Title'
              error={!!errors.title_en}
              helperText={errors.title_en?.message}
            />
          )}
        />

        {/* Arabic Title */}
        <Controller
          name='title_ar'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Arabic Title'
              error={!!errors.title_ar}
              helperText={errors.title_ar?.message}
            />
          )}
        />

        {/* English Description */}
        <Controller
          name='description_en'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              rows={2}
              multiline
              fullWidth
              label='English Description'
              error={!!errors.description_en}
              helperText={errors.description_en?.message}
            />
          )}
        />

        {/* Arabic Description */}
        <Controller
          name='description_ar'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              rows={2}
              multiline
              fullWidth
              label='Arabic Description'
              error={!!errors.description_ar}
              helperText={errors.description_ar?.message}
            />
          )}
        />

        {/* Video Type */}
        <Controller
          name='video_type'
          control={control}
          render={({ field }) => (
            <CustomAutocomplete
              fullWidth
              options={videoTypeOptions}
              getOptionLabel={(option: Option) => option.label || ''}
              value={videoTypeOptions.find(option => option.value === field.value) || null}
              onChange={(event, newValue: Option | null) => {
                field.onChange(newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Select Video Type'
                  fullWidth
                  error={!!errors.video_type}
                  helperText={errors.video_type?.message}
                />
              )}
            />
          )}
        />

        {/* Video Upload Section */}
        {videoType === 'upload' && (
          <Controller
            name='video'
            control={control}
            render={({ field }) => (
              <MediaUploader
                label='Upload Lecture Video'
                mediaType='video'
                onUpload={async file => {
                  const result = await handleUpload(file, 'video')

                  field.onChange(file)
                  setValue('video_url', result.url)

                  return result
                }}
                value={videoUrl}
                onChange={url => {
                  setValue('video_url', url || '')
                  if (!url) field.onChange(null)
                }}
                error={errors.video?.message}
                maxSize={209715200} // 200MB for videos
              />
            )}
          />
        )}

        {/* Video URL (for both upload and URL input) */}
        <Controller
          name='video_url'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Lecture Video URL'
              disabled={videoType === 'upload'} // Disable if uploading
              error={!!errors.video_url}
              helperText={errors.video_url?.message}
            />
          )}
        />

        {/* Thumbnail Upload Section */}
        <Controller
          name='video_thumb'
          control={control}
          render={({ field }) => (
            <MediaUploader
              label='Video Thumbnail'
              mediaType='image'
              onUpload={async file => {
                const result = await handleUpload(file, 'image')

                field.onChange(file)
                setValue('video_thumb_url', result.url)

                return result
              }}
              value={videoThumbUrl}
              onChange={url => {
                setValue('video_thumb_url', url || '')
                if (!url) field.onChange(null)
              }}
              error={errors.video_thumb?.message}
              maxSize={2097152} // 2MB for images
            />
          )}
        />

        {/* Course Selection */}
        <Controller
          name='course_id'
          control={control}
          render={({ field }) => (
            <CustomAutocomplete
              fullWidth
              options={courseOptions}
              getOptionLabel={(option: Option) => option.label || ''}
              value={courseOptions.find(option => option.value === field.value) || null}
              onChange={(event, newValue: Option | null) => {
                field.onChange(newValue ? newValue.value : 0)
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Choose Course'
                  fullWidth
                  error={!!errors.course_id}
                  helperText={errors.course_id?.message}
                />
              )}
            />
          )}
        />

        {/* Category Selection */}
        {courseId > 0 && (
          <Controller
            name='category_id'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                fullWidth
                options={categoriesOptions}
                getOptionLabel={(option: Option) => option.label || ''}
                value={categoriesOptions.find(option => option.value === field.value) || null}
                onChange={(event, newValue: Option | null) => {
                  field.onChange(newValue ? newValue.value : 0)
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Choose Category'
                    fullWidth
                    error={!!errors.category_id}
                    helperText={errors.category_id?.message}
                  />
                )}
              />
            )}
          />
        )}

        {/* Sub-Category Selection */}
        {courseId > 0 && categoryId > 0 && (
          <Controller
            name='sub_category_id'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                fullWidth
                options={subCategoryOptions}
                getOptionLabel={(option: Option) => option.label || ''}
                value={subCategoryOptions.find(option => option.value === field.value) || null}
                onChange={(event, newValue: Option | null) => {
                  field.onChange(newValue ? newValue.value : 0)
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Choose Sub-category'
                    fullWidth
                    error={!!errors.sub_category_id}
                    helperText={errors.sub_category_id?.message}
                  />
                )}
              />
            )}
          />
        )}

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
          <Button variant='contained' type='submit' sx={{ flex: 1 }}>
            Submit
          </Button>
          <Button variant='tonal' color='error' type='reset' onClick={handleReset} sx={{ flex: 1 }}>
            Reset
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
////
category_id: 88
course_id: 158
description_ar: 'mm'
description_en: 'mm'
file: {
  $path: ''
}
image_src: 'https://api.coursemia.com/storage/garbage_media/1742595912afbjqpgzkk.png'
is_free_content: '1'
path: 'https://www.youtube.com/watch?v=iLyKbfr89Mc'
sub_category_id: 91
title_ar: 'test2'
title_en: 'test2'
video: null
video_thumb: 391
video_type: 'url'


{
    "title_en": "aaa",
    "title_ar": "aa",
    "description_en": "aaaa",
    "description_ar": "",
    "is_free_content": "0",
    "course_id": 158,
    "category_id": 88,
    "sub_category_id": 89,
    "video": null,
    "path": "https://www.youtube.com/watch?v=iLyKbfr89Mc",
    "file": {
        "$path": ""
    },
    "video_type": "url"
}
