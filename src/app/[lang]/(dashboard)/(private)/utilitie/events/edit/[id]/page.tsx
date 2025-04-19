'use client'
import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, boolean, minLength, url } from 'valibot'
import { toast } from 'react-toastify'
import { Typography, Card, CardContent, Switch, Button, CircularProgress, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

// import MediaUploader from '@/components/MediaUploader'
import { fetchEventById, updateEvent } from '@/data/events/eventsQuery'
import CustomTextField from '@/@core/components/mui/TextField'

// Form data type
type FormDataType = {
  title_en: string
  title_ar: string | null
  event_url: string
  is_active: boolean
  image: File | null
  image_url: string
  image_id: string
}

// Valibot schema for validation
const schema = object({
  title_en: string([minLength(1, 'This field is required')]),
  title_ar: string(),
  event_url: string([minLength(1, 'This field is required'), url('Please enter a valid URL')]),
  is_active: boolean()
})

const EditEvent = () => {
  const { id } = useParams() // Get the event ID from the URL
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch event data
  const {
    data: eventResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id as string),
    enabled: !!id
  })

  const event = eventResponse?.data

  // Form setup
  const { control, handleSubmit, reset } = useForm<FormDataType>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      event_url: '',
      is_active: false,
      image: null,
      image_url: '',
      image_id: ''
    }
  })

  // Populate form with fetched data
  useEffect(() => {
    if (event) {
      reset({
        title_en: event.title_en,
        title_ar: event.title_ar,
        event_url: event.event_url,
        is_active: event.is_active,
        image: null,
        image_url: event.image,
        image_id: ''
      })
    }
  }, [event, reset])

  // const imageUrl = watch('image_url')

  // Mutation for updating the event
  const updateMutation = useMutation({
    mutationFn: (data: FormDataType) => {
      const payload = {
        id: Number(id),
        title_en: data.title_en,
        title_ar: data.title_ar,
        event_url: data.event_url,
        is_active: data.is_active,
        image: data.image_url,
        image_id: data.image_id
      }

      return updateEvent(payload)
    },
    onSuccess: response => {
      toast.success(response.message || 'Event updated successfully')
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      queryClient.invalidateQueries({ queryKey: ['events'] }) // Update the events list
      router.push(`/utilitie/events`)
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update event')
    }
  })

  // Handle form submission
  const onSubmit = (data: FormDataType) => {
    updateMutation.mutate(data)
  }

  // Handle form reset
  const handleReset = () => {
    reset({
      title_en: event?.title_en || '',
      title_ar: event?.title_ar || '',
      event_url: event?.event_url || '',
      is_active: event?.is_active || false,
      image: null,
      image_url: event?.image || '',
      image_id: ''
    })
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Error: {error.message || 'Failed to load event details'}
        </Typography>
      </Box>
    )
  }

  // Handle case where event is not found
  if (!event) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6'>Event not found</Typography>
      </Box>
    )
  }

  // Handle image upload (mock function - replace with your actual upload logic)
  // const uploadEventImage = async (file: File) => {
  //   const formData = new FormData()

  //   formData.append('media', file)

  //   // Replace with your actual API call to upload the image
  //   return { url: URL.createObjectURL(file), id: 'mock-id' } // Mock response
  // }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Edit Event
      </Typography>
      <Card>
        <CardContent>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <Grid container spacing={6}>
              {/* Title EN */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='title_en'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Title EN'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* Title AR */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='title_ar'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Title AR'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* Event URL */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='event_url'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Event URL'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* Is Active */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='is_active'
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>Is Active</Typography>
                      <Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    </Box>
                  )}
                />
              </Grid>
              {/* Image Upload */}
              {/* <Grid size={{ xs: 12 }}>
                <Controller
                  name='image'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {imageUrl && (
                        <Box
                          component='img'
                          src={imageUrl}
                          alt='Event Image'
                          sx={{ width: 60, height: 40, objectFit: 'cover' }}
                        />
                      )}
                      <MediaUploader
                        label='Select Event Image'
                        mediaType='image'
                        onUpload={async file => {
                          const result = await uploadEventImage(file)
                          field.onChange(file)
                          setValue('image_url', result.url)
                          setValue('image_id', result.id || '')
                          return result
                        }}
                        value={imageUrl}
                        onChange={url => {
                          setValue('image_url', url || '')
                          if (!url) field.onChange(null)
                        }}
                        error={error?.message}
                        maxSize={2097152} // 2MB for images
                        accept='image/*'
                      />
                    </Box>
                  )}
                />
              </Grid> */}
              {/* Buttons */}
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='error' // Matches the red color in the screenshot
                    sx={{ flex: 1 }}
                  >
                    Submit
                  </Button>
                  <Button type='button' variant='outlined' onClick={handleReset} sx={{ flex: 1 }}>
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EditEvent
