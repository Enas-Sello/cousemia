'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { updateCourse } from '@/data/courses/coursesQuery'
import { getSpecialties } from '@/data/specialties/specialtiesQuery'
import type { CourseFormType } from '@/types/courseType'
import type { SpecialityType } from '@/types/specialitiesType'
import Loading from '@/components/loading'

interface CourseFormData extends CourseFormType {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  price: number
  price_after_discount?: number
  has_discount: boolean
  expire_date_type: string
  expire_date: string | Date
  speciality_id: number
  is_active: boolean
  cover_image?: File | string
}

export default function CourseUpdateForm({ courseData, isCourseLoading }: any) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch specialties for the dropdown
  const { data: specialtiesData, isLoading: isSpecialtiesLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => getSpecialties({})
  })

  const specialties = specialtiesData?.specialities ?? []

  const {
    control,
    handleSubmit,

    //@ts-ignore
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CourseFormData>({
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      price: 0,
      price_after_discount: 0,
      has_discount: false,
      expire_date_type: 'Fixed Duration',
      expire_date: '3 Months',
      speciality_id: 0,
      is_active: false,
      cover_image: undefined
    }
  })

  // Watch the has_discount and expire_date_type fields
  const hasDiscount = watch('has_discount')
  const expireDateType = watch('expire_date_type')

  // Set initial form values when course data is fetched
  useEffect(() => {
    if (courseData) {
      reset({
        title_en: courseData.title_en || '',
        title_ar: courseData.title_ar || '',
        description_en: courseData.description_en || '',
        description_ar: courseData.description_ar || '',
        price: courseData.price || 0,
        price_after_discount: courseData.price_after_discount ? parseFloat(courseData.price_after_discount) : 0,
        has_discount: !!courseData.price_after_discount,
        expire_date_type: courseData.expire_date_type || 'Fixed Duration',
        expire_date: courseData.expire_duration || '3 Months',
        speciality_id: courseData.speciality_id || 0,
        is_active: courseData.is_active || false,
        cover_image: courseData.image || undefined
      })

      if (courseData.image) {
        setPreviewImage(courseData.image)
      }
    }
  }, [courseData, reset])

  // Handle image file change and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setValue('cover_image', file)
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  // Mutation for updating the course
  const updateCourseMutation = useMutation({
    mutationFn: (formData: CourseFormData) => {
      const data = new FormData()

      data.append('title_en', formData.title_en)
      data.append('title_ar', formData.title_ar)
      data.append('description_en', formData.description_en)
      data.append('description_ar', formData.description_ar)
      data.append('price', formData.price.toString())
      data.append('has_discount', formData.has_discount ? '1' : '0')

      if (formData.has_discount && formData.price_after_discount) {
        data.append('price_after_discount', formData.price_after_discount.toString())
      }

      data.append('expire_date_type', formData.expire_date_type)

      // Format expire_date based on expire_date_type
      if (formData.expire_date_type === 'Custom Date' && formData.expire_date instanceof Date) {
        data.append('expire_duration', formData.expire_date.toISOString().split('T')[0]) // Format as YYYY-MM-DD
      } else {
        data.append('expire_duration', formData.expire_date as string)
      }

      data.append('speciality_id', formData.speciality_id.toString())
      data.append('is_active', formData.is_active ? '1' : '0')

      if (formData.cover_image instanceof File) {
        data.append('image', formData.cover_image)
      }

      return updateCourse(courseData?.id, data)
    },
    onSuccess: () => {
      toast.success('Course updated successfully')
      queryClient.invalidateQueries({ queryKey: ['course', courseData?.id] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      router.push('/study/courses')
    },
    onError: (error: any) => {
      toast.error(error.response?.data.message || 'Failed to update course.')
    }
  })

  // Handle form submission
  const onSubmit = (formData: CourseFormData) => {
    updateCourseMutation.mutate(formData)
  }

  if (isCourseLoading || isSpecialtiesLoading) {
    return <Loading />
  }

  // Find the selected specialty object based on speciality_id
  const selectedSpecialty = specialties.find((specialty: SpecialityType) => specialty.id === watch('speciality_id'))

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
                rules={{ required: 'Title AR is required' }}
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
                rules={{ required: 'Description AR is required' }}
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

            {/* Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='price'
                control={control}
                rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be a positive number' } }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    type='number'
                    fullWidth
                    label='Price'
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>

            {/* Has Discount */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>Has Discount</Typography>
              <Controller
                name='has_discount'
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    value={field.value}
                    onChange={e => field.onChange(e.target.value === 'true')}
                  >
                    <FormControlLabel value={true} control={<Radio />} label='Yes' />
                    <FormControlLabel value={false} control={<Radio />} label='No' />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Price After Discount (Conditional) */}
            {hasDiscount && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='price_after_discount'
                  control={control}
                  rules={{
                    required: hasDiscount ? 'Price after discount is required' : false,
                    min: { value: 0, message: 'Price after discount must be a positive number' }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      type='number'
                      fullWidth
                      label='Price After Discount'
                      error={!!errors.price_after_discount}
                      helperText={errors.price_after_discount?.message}
                    />
                  )}
                />
              </Grid>
            )}

            {/* Expire Date Type */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='expire_date_type'
                control={control}
                rules={{ required: 'Expire Date Type is required' }}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    options={['Fixed Duration', 'Custom Date']}
                    getOptionLabel={option => option}
                    onChange={(event, value) => {
                      field.onChange(value)

                      // Reset expire_date when type changes
                      setValue('expire_date', value === 'Custom Date' ? new Date() : '3 Months')
                    }}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Expire Date Type'
                        error={!!errors.expire_date_type}
                        helperText={errors.expire_date_type?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Expire Date (Conditional: Autocomplete or DatePicker) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='expire_date'
                control={control}
                rules={{ required: 'Expire Date is required' }}
                render={({ field }) =>
                  expireDateType === 'Custom Date' ? (
                    <DatePicker
                      selected={field.value instanceof Date ? field.value : new Date()}
                      onChange={(date: Date | null) => {
                        if (date) {
                          field.onChange(date)
                        }
                      }}
                      dateFormat='yyyy-MM-dd'
                      customInput={
                        <CustomTextField
                          fullWidth
                          label='Expire Date'
                          error={!!errors.expire_date}
                          helperText={errors.expire_date?.message}
                        />
                      }
                    />
                  ) : (
                    <CustomAutocomplete
                      {...field}
                      options={['1 Month', '3 Months', '6 Months']}
                      getOptionLabel={option => option}
                      value={typeof field.value === 'string' ? field.value : null} // Ensure value is a string or null
                      onChange={(event, value) => field.onChange(value)}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          label='Expire Date'
                          error={!!errors.expire_date}
                          helperText={errors.expire_date?.message}
                        />
                      )}
                    />
                  )
                }
              />
            </Grid>

            {/* Select Specialty */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='speciality_id'
                control={control}
                rules={{ required: 'Specialty is required' }}
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    options={specialties}
                    value={selectedSpecialty || null} // Map speciality_id to the full SpecialityType object
                    getOptionLabel={(option: SpecialityType) => option.title_en || ''}
                    onChange={(event, value) => field.onChange(value?.id || 0)} // Update form with the selected id
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Select Specialty'
                        error={!!errors.speciality_id}
                        helperText={errors.speciality_id?.message}
                      />
                    )}
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

            {/* Cover Image */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name='cover_image'
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
              <Button variant='contained' type='submit' disabled={updateCourseMutation.isPending}>
                {updateCourseMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
