'use client'

// import { useState } from 'react'

// import {  useQueryClient } from '@tanstack/react-query'
import { boolean, minLength, minValue, number, object, string } from 'valibot'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Box, Divider, Drawer, IconButton, Typography } from '@mui/material'

// import { useDropzone } from 'react-dropzone'

import CustomTextField from '@/@core/components/mui/TextField'
import MediaUploader from '@/components/MediaUploader'

type AddNewProps = {
  open: boolean
  handleClose: () => void
}

type FormDataType = {
  title_en: string
  title_ar: string
  country_code: number
  is_active: boolean
  flag: File | null
  flagUrl?: string // To store the uploaded flag URL for preview
}

// const initialData = {
//   title_en: '',
//   title_ar: '',
//   is_active: true,
//   country_code: +20,
//   flag: ''
// }

const schema = object({
  title_en: string([minLength(1, 'This field is required')]),
  title_ar: string([minLength(1, 'This field is required')]),
  country_code: number([minValue(1, 'This field is required')]),
  is_active: boolean()
})

const AddOffersDrawer = ({ open, handleClose }: AddNewProps) => {
  // const queryClient = useQueryClient()
  // const [formData, setFormData] = useState<FormDataType>(initialData)
  // const [videoUploading, setVideoUploading] = useState(false)
  // const [imageUploading, setImageUploading] = useState(false)

  const {
    control,

    // handleSubmit,
    //@ts-ignore
    formState: { errors },
    reset,

    // setError,
    setValue,
    watch
  } = useForm<FormDataType>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      is_active: true,
      country_code: 20,
      flag: null,
      flagUrl: ''
    }
  })

  const flagUrl = watch('flagUrl')

  // Handle file upload (for flag image)
  const handleUpload = async (file: File, type: 'image' | 'video') => {
    console.log("🚀 ~ handleUpload ~ type:", type)
    const data = new FormData()

    data.append('name', 'flag-image')
    data.append('media', file)

    // Simulate your uploadImage API (replace with your actual API)
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: data
    }).then(res => res.json())

    return { url: uploadResponse.url, id: uploadResponse.id }
  }

  // Handle form submission
  // const mutation = useMutation({
  //   mutationFn: () => {},
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['countries'])
  //     reset()
  //     handleClose()
  //   },
  //   onError: (error: Error) => {
  //     setError('root', { message: error.message })
  //   }
  // })

  // const onSubmit = (data: FormDataType) => {
  //   if (!data.flag) {
  //     setError('flag', { message: 'Flag image is required' })

  //     return
  //   }

  //   mutation.mutate({ ...data, flag: data.flag })
  // }

  const handleReset = () => {
    handleClose()
    reset()
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
        <Typography variant='h5'>Add New Country</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </Box>
      <Divider />
      {/* <Box component='form' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'> */}
      <Box component='form' onSubmit={() => {}} className='flex flex-col gap-6 p-6'>
        <Controller
          name='title_en'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              label='English Title'
              placeholder='Country Title En'
              fullWidth
              {...field}
              error={!!errors.title_en}
              helperText={errors.title_en?.message}
            />
          )}
        />

        <Controller
          name='title_ar'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              label='Arabic Title'
              placeholder='Country Title Ar'
              fullWidth
              {...field}
              error={!!errors.title_ar}
              helperText={errors.title_ar?.message}
            />
          )}
        />

        <Controller
          name='country_code'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              label='Country Code'
              placeholder='+20'
              type='number'
              fullWidth
              {...field}
              error={!!errors.country_code}
              helperText={errors.country_code?.message}
            />
          )}
        />

        {/* Flag Uploader */}
        <Controller
          name='flag'
          control={control}
          render={({ field }) => (
            <MediaUploader
              label='Flag'
              mediaType='image' // Only accept images for the flag
              onUpload={async file => {
                const result = await handleUpload(file, 'image')

                field.onChange(file) // Update form value
                setValue('flagUrl', result.url) // Update URL for preview

                return result
              }}
              value={flagUrl}
              onChange={url => {
                setValue('flagUrl', url || '')
                if (!url) field.onChange(null) // Clear file if removed
              }}
              error={errors.flag?.message}
            />
          )}
        />
      </Box>
    </Drawer>
  )
}

export default AddOffersDrawer
