'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button, Card, CardContent, FormControlLabel, Switch, Typography, Alert } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import Loading from '@/components/loading'
import { getCategories } from '@/data/categories/categoriesQuerys'
import { updateLecture } from '@/data/lectures/lecturesQuery'
import type { CategoriesResponse, CategoryTypeData } from '@/types/categoryType'
import type { LectureType, SubCategory } from '@/types/lectureType'

// Define the form data type
interface LectureFormData {
  title_en: string
  title_ar: string
  url: string
  description_en: string
  description_ar: string
  category_id: number
  sub_category_id: number
  is_active: boolean
  is_free_content: boolean
  image?: File | string
}

export default function LectureUpdateForm({
  lectureData,
  isLectureLoading
}: {
  lectureData: LectureType | undefined
  isLectureLoading: boolean
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Fetch categories for the dropdown
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => getCategories({})
  })

  const categories = categoriesData?.categories ?? []

  // Initialize the form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<LectureFormData>({
    defaultValues: {
      title_en: '',
      title_ar: '',
      url: '',
      description_en: '',
      description_ar: '',
      category_id: 0,
      sub_category_id: 0,
      is_active: false,
      is_free_content: false,
      image: undefined
    }
  })

  // Watch the category_id to dynamically update subcategories
  const selectedCategoryId = watch('category_id')
  const selectedCategory = categories.find(category => category.id === selectedCategoryId)
  const subCategories = selectedCategory?.sub_categories ?? []

  // Set initial form values when lecture data is fetched
  useEffect(() => {
    if (lectureData) {
      reset({
        title_en: lectureData.title_en || '',
        title_ar: lectureData.title_ar || '',
        url: lectureData.url || '',
        description_en: lectureData.description_en || '',
        description_ar: lectureData.description_ar || '',
        category_id: lectureData.category_id || 0,
        sub_category_id: lectureData.sub_category_id || 0,
        is_active: lectureData.is_active || false,
        is_free_content: lectureData.is_free_content || false,
        image: lectureData.image || undefined
      })

      if (lectureData.image) {
        setPreviewImage(lectureData.image)
      }
    }
  }, [lectureData, reset])

  // Handle image file change and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setValue('image', file)
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  // Mutation for updating the lecture
  const updateLectureMutation = useMutation({
    mutationFn: (formData: LectureFormData) => {
      const data = new FormData()

      data.append('title_en', formData.title_en)
      if (formData.title_ar) data.append('title_ar', formData.title_ar)
      data.append('url', formData.url)
      data.append('description_en', formData.description_en)
      if (formData.description_ar) data.append('description_ar', formData.description_ar)
      data.append('category_id', formData.category_id.toString())
      data.append('sub_category_id', formData.sub_category_id.toString())
      data.append('is_active', formData.is_active ? '1' : '0')
      data.append('is_free_content', formData.is_free_content ? '1' : '0')

      if (formData.image instanceof File) {
        data.append('image', formData.image)
      }

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

  if (isLectureLoading || isCategoriesLoading) {
    return <Loading />
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
            {/* Title EN */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='title_en'
                control={control}
                rules={{ required: 'Title EN is required' }}
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

            {/* URL */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name='url'
                control={control}
                rules={{ required: 'Video URL is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Video URL'
                    error={!!errors.url}
                    helperText={errors.url?.message}
                  />
                )}
              />
            </Grid>

            {/* Description EN */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='description_en'
                control={control}
                rules={{ required: 'Description EN is required' }}
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

            {/* Description AR */}
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

            {/* Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='category_id'
                control={control}
                rules={{
                  required: 'Category is required',
                  validate: value => value > 0 || 'Please select a valid category'
                }}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    options={categories}
                    value={
                      categories.find(category => {
                        category.id === field.value
                        console.log('🚀 ~ category:', category.id)
                        console.log('🚀 ~ field.value:', field.value)

                      }) || null
                    }
                    getOptionLabel={(option: CategoryTypeData) => option.title_en || ''}
                    onChange={(event, value) => {
                      field.onChange(value?.id || 0)
                      setValue('sub_category_id', 0)
                    }}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Select Category'
                        error={!!errors.category_id}
                        helperText={errors.category_id?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Subcategory */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='sub_category_id'
                control={control}
                rules={{
                  required: 'Subcategory is required',
                  validate: value => value > 0 || 'Please select a valid subcategory'
                }}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    options={subCategories}
                    value={subCategories.find((sub: SubCategory) => sub.value === field.value) || null}
                    getOptionLabel={(option: SubCategory) => option.label || ''}
                    onChange={(event, value) => field.onChange(value?.value || 0)}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Select Subcategory'
                        error={!!errors.sub_category_id}
                        helperText={errors.sub_category_id?.message}
                      />
                    )}
                    disabled={!selectedCategoryId}
                    noOptionsText={selectedCategoryId ? 'No subcategories available' : 'Select a category first'}
                  />
                )}
              />
            </Grid>

            {/* Is Active */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='is_active'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                    label='Is Active'
                  />
                )}
              />
            </Grid>

            {/* Is Free Content */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='is_free_content'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                    label='Is Free Content'
                  />
                )}
              />
            </Grid>

            {/* Cover Image */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name='image'
                control={control}
                render={() => (
                  <div>
                    {previewImage && (
                      <img src={previewImage} alt='Cover Preview' style={{ width: '200px', marginBottom: '10px' }} />
                    )}
                    <Typography variant='body2' color='textSecondary'>
                      Only images are accepted.
                    </Typography>
                    <Button variant='contained' component='label'>
                      Select Cover Image
                      <input type='file' accept='image/*' hidden onChange={handleImageChange} />
                    </Button>
                  </div>
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit' disabled={updateLectureMutation.isPending}>
                {updateLectureMutation.isPending ? 'Saving...' : 'Save Changes'}
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
