'use client'

import React from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Drawer, Box, Typography, IconButton, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import { createFlashCard } from '@/data/flashCards/flashCardsQuery'

type FormData = {
  front_en: string
  front_ar: string
  back_en: string
  back_ar: string
  is_free_content: boolean
  course_id: number
  category_id: number
  sub_category_id?: number
}

type AddFlashCardDrawerProps = {
  open: boolean
  handleClose: () => void
  courseId: number | undefined
  categoryId: number | undefined
  subCategoryId: number | undefined
}

export default function AddFlashCardDrawer({
  open,
  handleClose,
  courseId,
  categoryId,
  subCategoryId
}: AddFlashCardDrawerProps) {
  console.log("🚀 ~ subCategoryId:", subCategoryId)
  console.log("🚀 ~ categoryId:", categoryId)
  console.log("🚀 ~ courseId:", courseId)
  const queryClient = useQueryClient()

  // React Hook Form setup
  const { control, handleSubmit, reset } = useForm<FormData>({
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

  // Mutation to create a new flash card
  const createMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        front_en: data.front_en,
        front_ar: data.front_ar,
        back_en: data.back_en,
        back_ar: data.back_ar,
        is_free_content: data.is_free_content ? 1 : 0,
        course_id: data.course_id,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id || null
      }

      return createFlashCard(payload)
    },
    onSuccess: () => {
      toast.success('Flash Card created successfully')
      queryClient.invalidateQueries({ queryKey: ['flashCards'] })
      handleClose()
      reset() // Reset the form after successful submission
    },
    onError: () => {
      toast.error('Failed to create flash card. Please try again.')
    }
  })

  // Handle form submission
  const onSubmit = (formData: FormData) => {
    createMutation.mutate(formData)
  }

  // Handle drawer close with form reset
  const onClose = () => {
    handleClose()
    reset()
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, p: 3 }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h6'>Add New Flash Card</Typography>
        <IconButton onClick={onClose}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* English Front */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name='front_en'
            control={control}
            rules={{ required: 'English Front is required' }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField {...field} label='English Front' fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        </Box>

        {/* Arabic Front */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name='front_ar'
            control={control}
            rules={{ required: 'Arabic Front is required' }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField {...field} label='Arabic Front' fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        </Box>

        {/* English Back */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name='back_en'
            control={control}
            rules={{ required: 'English Back is required' }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField {...field} label='English Back' fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        </Box>

        {/* Arabic Back */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name='back_ar'
            control={control}
            rules={{ required: 'Arabic Back is required' }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField {...field} label='Arabic Back' fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        </Box>

        {/* Is Free Content */}
        <Box sx={{ mb: 3 }}>
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
        </Box>

        {/* Submit and Cancel Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type='submit'
            variant='contained'
            sx={{ backgroundColor: '#ff4081', '&:hover': { backgroundColor: '#f50057' } }}
          >
            Add
          </Button>
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Drawer>
  )
}
