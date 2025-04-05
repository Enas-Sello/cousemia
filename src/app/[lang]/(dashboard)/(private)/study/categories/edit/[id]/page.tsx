'use client'
import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'

import { getCategoryById, updateCategory } from '@/data/categories/categoriesQuerys'
import type { CourseCategoryType } from '@/types/categoryType'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'

import CustomTextField from '@/@core/components/mui/TextField'

type SubCategory = {
  title_en: string
  title_ar: string
}

type FormData = {
  title_en: string
  title_ar: string
  subs: SubCategory[]
}

export default function EditCategory({ params }: { params: { id: any } }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const categoryId = parseInt(params.id, 10)

  // Fetch category data
  const {
    data: categoryResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId
  })

  // Access the nested data property
  const category = categoryResponse?.data


  // React Hook Form setup

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      title_en: '',
      title_ar: '',
      subs: []
    }
  })

  // Use useFieldArray to manage dynamic subcategory fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subs'
  })

  useEffect(() => {
    if (category) {
      reset({
        title_en: category.title_en || '',
        title_ar: category.title_ar || '',
        subs:
          category.subs?.map((sub: SubCategory) => ({
            title_en: sub.title_en || '',
            title_ar: sub.title_ar || ''
          })) || []
      })
    }
  }, [category, reset])

  // Mutation to update the category
  const updateMutation = useMutation({
    mutationFn: (data: Partial<CourseCategoryType>) => updateCategory(categoryId, data),
    onSuccess: () => {
      toast.success('Category updated successfully')
      queryClient.invalidateQueries({ queryKey: ['categories'] }) // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] }) // Invalidate this category
      router.push('/study/categories') // Redirect to categories list (adjust the route as needed)
    },
    onError: () => {
      toast.error('Failed to update category. Please try again.')
    }
  })

  // Handle form submission
  const onSubmit = (formData: FormData) => {
    const payload = {
      title_en: formData.title_en,
      title_ar: formData.title_ar,
      subs: formData.subs.map(sub => ({
        title_en: sub.title_en,
        title_ar: sub.title_ar,
        course_name: category?.course_name || '',
        parent_category: formData.title_en,
        subs: []
      }))
    }

    updateMutation.mutate(payload)
  }

  // Handle adding a new subcategory
  const handleAddSubCategory = () => {
    append({ title_en: '', title_ar: '' })
  }

  // Handle deleting a subcategory
  const handleDeleteSubCategory = (index: number) => {
    remove(index)
  }

  // Handle form reset
  const handleReset = () => {
    reset({
      title_en: category?.title_en || '',
      title_ar: category?.title_ar || '',
      subs:
        category?.subs?.map((sub: SubCategory) => ({
          title_en: sub.title_en || '',
          title_ar: sub.title_ar || ''
        })) || []
    })
  }

  // Handle loading and error states
  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorBox refetch={refetch} error={error} />
  }

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <>
      {category && (
        <Card>
          <CardHeader title={`Edit Category with course name  " ${category.course_name} " `} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='title_en'
                    control={control}
                    rules={{ required: 'Title (EN) is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextField
                        {...field}
                        label='Title (EN)'
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='title_ar'
                    control={control}
                    rules={{ required: 'Title (AR) is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextField
                        {...field}
                        label='Title (AR)'
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                {/* Subcategory Fields */}{' '}
                {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Controller
                        name={`subs.${index}.title_en`}
                        control={control}
                        rules={{ required: 'Subcategory Title (EN) is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <CustomTextField
                            {...field}
                            label={`English Title For Subcategory ${index + 1}`}
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Controller
                        name={`subs.${index}.title_ar`}
                        control={control}
                        rules={{ required: 'Subcategory Title (AR) is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <CustomTextField
                            {...field}
                            label={`Arabic Title For Subcategory ${index + 1}`}
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        variant='contained'
                        color='error'
                        onClick={() => handleDeleteSubCategory(index)}
                        sx={{ mt: 1 }}
                      >
                        Delete Sub
                      </Button>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Button variant='contained' color='primary' onClick={handleAddSubCategory}>
                    Add Sub Category
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type='submit' variant='contained' color='primary'>
                      submit
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={handleReset}>
                      Reset
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => router.push('/study/categories')}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
