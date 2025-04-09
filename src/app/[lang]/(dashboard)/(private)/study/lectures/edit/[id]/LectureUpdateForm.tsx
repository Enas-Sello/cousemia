'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button, Card, CardContent, Alert } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import CustomTextField from '@/@core/components/mui/TextField'
import { updateLecture } from '@/data/lectures/lecturesQuery'
import type { LectureType } from '@/types/lectureType'
import FiltersDataInput from '@/components/FiltersDataInput'
import BasicFields from '@/components/BasicFields'
import ImageUploadField from '@/components/ImageUploadField'
import VideoTypeField from '@/components/VideoTypeField'
import SwitchFields from '@/components/SwitchFields'
import { LectureFormSchema } from '@/schema/LectureSchema/LectureFormSchema'

// Define the LectureFormData interface
interface LectureFormData {
  title_en: string
  title_ar: string | null
  video_type: string
  url: string
  description_en: string
  description_ar: string | null
  course_id: number | undefined
  category_id: number | undefined
  sub_category_id: number | undefined
  is_active: boolean
  is_free_content: boolean
  image?: string
}

// Main component
export default function LectureUpdateForm({ lectureData }: { lectureData: LectureType | undefined }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Initialize the form with Valibot validation
  const {
    control,
    handleSubmit,
    //@ts-ignore
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<LectureFormData>({
    defaultValues: {
      title_en: '',
      title_ar: null,
      video_type: '',
      url: '',
      description_en: '',
      description_ar: null,
      course_id: undefined,
      category_id: undefined,
      sub_category_id: undefined,
      is_active: false,
      is_free_content: false,
      image: undefined
    },
    resolver: valibotResolver(LectureFormSchema),
    mode: 'onChange'
  })

  // Watch form values for course_id, category_id, and sub_category_id
  const courseId = watch('course_id')
  const categoryId = watch('category_id')
  const subCategoryId = watch('sub_category_id')

  // Set initial form values when lecture data is fetched
  useEffect(() => {
    if (lectureData) {
      reset({
        title_en: lectureData.title_en || '',
        title_ar: lectureData.title_ar || null,
        video_type: lectureData.url ? 'url' : 'upload', // Verify with backend if "url" or "upload" is expected
        url: lectureData.url || '',
        description_en: lectureData.description_en || '',
        description_ar: lectureData.description_ar || null,
        course_id: lectureData.course_id || undefined,
        category_id: lectureData.category_id || undefined,
        sub_category_id: lectureData.sub_category_id || undefined,
        is_active: lectureData.is_active || false,
        is_free_content: lectureData.is_free_content || false,
        image: lectureData.image || undefined
      })
    }
  }, [lectureData, reset])

  // Mutation for updating the lecture
  const updateLectureMutation = useMutation({
    mutationFn: (formData: LectureFormData) => {
      const data = new FormData()
      data.append('title_en', formData.title_en)
      if (formData.title_ar) data.append('title_ar', formData.title_ar)
      data.append('video_type', formData.video_type)
      data.append('url', formData.url)
      data.append('description_en', formData.description_en)
      if (formData.description_ar) data.append('description_ar', formData.description_ar)
      if (formData.course_id) data.append('course_id', formData.course_id.toString())
      if (formData.category_id) data.append('category_id', formData.category_id.toString())
      if (formData.sub_category_id) data.append('sub_category_id', formData.sub_category_id.toString())
      data.append('is_active', formData.is_active ? '1' : '0')
      data.append('is_free_content', formData.is_free_content ? '1' : '0')
      if (formData.image) data.append('image', formData.image) 
      if (lectureData?.id === undefined) {
        throw new Error('Lecture ID is undefined')
      }

      return updateLecture(lectureData.id, data)
    },
    onSuccess: () => {
      toast.success('Lecture updated successfully')
      queryClient.invalidateQueries({ queryKey: ['lecture', lectureData?.id] })
      queryClient.invalidateQueries({ queryKey: ['lectures'] })
      router.push('/study/lectures')
    },
    onError: (error: any) => {
      toast.error(error.response?.data.message || 'Failed to update lecture.')
    }
  })

  // Handle form submission
  const onSubmit = (formData: LectureFormData) => {
    updateLectureMutation.mutate(formData)
  }

  if (!lectureData) {
    return (
      <Alert severity='error' sx={{ mt: 4 }}>
        Lecture not found.
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <BasicFields control={control} errors={errors} />
            {/* Lecture URL */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='url'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Lecture URL'
                    error={!!errors.url}
                    helperText={errors.url?.message}
                  />
                )}
              />
            </Grid>
            <VideoTypeField control={control} errors={errors} />
            <Grid size={{ xs: 12 }}>
              <ImageUploadField
                control={control}
                fieldName='image'
                initialImageUrl={lectureData?.image || null}
                setValue={setValue}
                label='Cover Image'
              />
            </Grid>
            {/* Filters (Course, Category, Subcategory) */}
            <Grid size={{ xs: 12 }}>
              <FiltersDataInput
                courseId={courseId}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
                setCourseId={id => setValue('course_id', id)}
                setCategoryId={id => setValue('category_id', id)}
                setSubCategoryId={id => setValue('sub_category_id', id)}
                drawer
              />
            </Grid>
            <SwitchFields control={control} />
            {/* Submit, Reset, and Cancel Buttons */}
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' disabled={updateLectureMutation.isPending}>
                {updateLectureMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant='outlined' onClick={() => reset()} disabled={updateLectureMutation.isPending}>
                Reset
              </Button>
              <Button
                variant='outlined'
                onClick={() => router.push('/study/lectures')}
                disabled={updateLectureMutation.isPending}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
