'use client'

import React, { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Drawer, Box, Typography, IconButton, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import { createFlashCard } from '@/data/flashCards/flashCardsQuery'
import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import { getCourseByCategoriesID } from '@/data/courses/coursesQuery'
import type { AddFlashCardDrawerProps, FlashCardsDataType } from '@/types/flashCardType'

export default function AddFlashCardDrawer({ open, handleClose, coursCategoryId }: AddFlashCardDrawerProps) {
  const queryClient = useQueryClient()
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(undefined)

  // Fetch course by category ID
  const { data: courseData } = useQuery({
    queryKey: ['courseByCategory', coursCategoryId],
    queryFn: () => getCourseByCategoriesID(coursCategoryId || 0),
    enabled: !!coursCategoryId
  })

  // Handle successful data fetch
  useEffect(() => {
    if (courseData?.data?.course_id) {
      setCourseId(courseData?.data?.course_id)
    }

    if (coursCategoryId) {
      setCategoryId(coursCategoryId)
    }
  }, [courseData, coursCategoryId])

  const { control, handleSubmit, reset } = useForm<FlashCardsDataType>({
    defaultValues: {
      front_en: '',
      front_ar: '',
      back_en: '',
      back_ar: '',
      is_free_content: false,
      course_id: courseId || 0,
      category_id: categoryId || 0,
      sub_category_id: subCategoryId || undefined
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: FlashCardsDataType) => {
      return createFlashCard(data)
    },
    onSuccess: () => {
      toast.success('Flash Card created successfully')
      queryClient.invalidateQueries({ queryKey: ['flashCards'] })
      handleClose()
      reset()
    },
    onError: () => {
      toast.error('Failed to create flash card. Please try again.')
    }
  })

  const onSubmit = (formData: FlashCardsDataType) => {
    const apiPayload: FlashCardsDataType = {
      front_en: formData.front_en,
      front_ar: formData.front_ar,
      back_en: formData.back_en,
      back_ar: formData.back_ar,
      course_id: courseId?.toString() || '',
      category_id: categoryId?.toString() || '',
      sub_category_id: subCategoryId?.toString() || null,
      is_free_content: formData.is_free_content ? '1' : '0'
    }

    createMutation.mutate(apiPayload)
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h6'>Add New Flash Card</Typography>
        <IconButton onClick={handleClose}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='front_en'
              control={control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  label='English Front'
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='front_ar'
              control={control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  label='Arabic Front'
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='back_en'
              control={control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  label='English Back'
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name='back_ar'
              control={control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField {...field} label='Arabic Back' fullWidth error={!!error} helperText={error?.message} />
              )}
            />
          </Grid>

          {!coursCategoryId && (
            <Grid size={{ xs: 12 }}>
              <FiltersDataInput
                courseId={courseId}
                categoryId={categoryId}
                setCourseId={setCourseId}
                setCategoryId={setCategoryId}
                setSubCategoryId={setSubCategoryId}
                drawer
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Typography>Is Free Content</Typography>
            <Controller
              name='is_free_content'
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  value={field.value ? 'yes' : 'no'}
                  onChange={e => field.onChange(e.target.value === 'yes')}
                >
                  <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                  <FormControlLabel value='no' control={<Radio />} label='No' />
                </RadioGroup>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2 }}>
            <Button
              type='submit'
              variant='contained'
              sx={{ backgroundColor: '#ff4081', '&:hover': { backgroundColor: '#f50057' } }}
            >
              Add
            </Button>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Drawer>
  )
}
