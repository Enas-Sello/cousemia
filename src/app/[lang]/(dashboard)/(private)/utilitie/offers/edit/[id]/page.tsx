'use client'
import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, boolean, minLength, array } from 'valibot'
import { toast } from 'react-toastify'
import { Typography, Card, CardContent, Switch, Button, CircularProgress, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

// import MediaUploader from '@/components/MediaUploader'
import type { SelectedCourse } from '@/data/offers/offersQuery'
import { fetchOfferById, updateOffer } from '@/data/offers/offersQuery'
import CustomTextField from '@/@core/components/mui/TextField'

// Form data type
type FormDataType = {
  title_en: string
  title_ar: string | null
  offer_value: string
  offer_type: string
  offer_code: string
  expiration_date: string
  selected_courses: SelectedCourse[]
  is_active: boolean
  image: File | null
  image_url: string
  image_id: string
}

// Valibot schema for validation
const schema = object({
  title_en: string([minLength(1, 'This field is required')]),
  title_ar: string(),
  offer_value: string([minLength(1, 'This field is required')]),
  offer_type: string([minLength(1, 'This field is required')]),
  offer_code: string([minLength(1, 'This field is required')]),
  expiration_date: string([minLength(1, 'This field is required')]), // You can add date validation if needed
  selected_courses: array(object({ value: string(), title: string() })),
  is_active: boolean()
})

const EditOffer = () => {
  const { id } = useParams() // Get the offer ID from the URL
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch offer data
  const {
    data: offerResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => fetchOfferById(id as string),
    enabled: !!id
  })

  const offer = offerResponse?.data

  // Form setup
  const { control, handleSubmit, reset } = useForm<FormDataType>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      offer_value: '',
      offer_type: '',
      offer_code: '',
      expiration_date: '',
      selected_courses: [],
      is_active: false,
      image: null,
      image_url: '',
      image_id: ''
    }
  })

  // Populate form with fetched data
  useEffect(() => {
    if (offer) {
      reset({
        title_en: offer.title_en,
        title_ar: offer.title_ar,
        offer_value: offer.offer_value,
        offer_type: offer.offer_type,
        offer_code: offer.offer_code,
        expiration_date: offer.expiration_date,
        selected_courses: offer.selected_courses,
        is_active: offer.is_active,
        image: null,
        image_url: offer.image,
        image_id: ''
      })
    }
  }, [offer, reset])

  // const imageUrl = watch('image_url')

  // Mutation for updating the offer
  const updateMutation = useMutation({
    mutationFn: (data: FormDataType) => {
      const payload = {
        id: Number(id),
        title_en: data.title_en,
        title_ar: data.title_ar,
        offer_value: data.offer_value,
        offer_type: data.offer_type,
        offer_code: data.offer_code,
        expiration_date: data.expiration_date,
        selected_courses: data.selected_courses,
        is_active: data.is_active,
        image: data.image_url,
        image_id: data.image_id
      }

      return updateOffer(payload)
    },
    onSuccess: response => {
      toast.success(response.message || 'Offer updated successfully')
      queryClient.invalidateQueries({ queryKey: ['offer', id] })
      queryClient.invalidateQueries({ queryKey: ['offers'] }) // Update the offers list
      router.push(`/utilitie/offers`)
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update offer')
    }
  })

  // Handle form submission
  const onSubmit = (data: FormDataType) => {
    updateMutation.mutate(data)
  }

  // Handle form reset
  const handleReset = () => {
    reset({
      title_en: offer?.title_en || '',
      title_ar: offer?.title_ar || '',
      offer_value: offer?.offer_value || '',
      offer_type: offer?.offer_type || '',
      offer_code: offer?.offer_code || '',
      expiration_date: offer?.expiration_date || '',
      selected_courses: offer?.selected_courses || [],
      is_active: offer?.is_active || false,
      image: null,
      image_url: offer?.image || '',
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
          Error: {error.message || 'Failed to load offer details'}
        </Typography>
      </Box>
    )
  }

  // Handle case where offer is not found
  if (!offer) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6'>Offer not found</Typography>
      </Box>
    )
  }

  // Handle image upload (mock function - replace with your actual upload logic)
  // const uploadOfferImage = async (file: File) => {
  //   const formData = new FormData()

  //   formData.append('media', file)

  //   // Replace with your actual API call to upload the image
  //   return { url: URL.createObjectURL(file), id: 'mock-id' } // Mock response
  // }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Edit Offer
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
              {/* Offer Value */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='offer_value'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Offer Value'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* Offer Type */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='offer_type'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Offer Type'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* Offer Code */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='offer_code'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Offer Code'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* Expiration Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='expiration_date'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Expiration Date'
                      type='date'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              {/* Selected Courses (Display Only - Replace with a proper selector in a real app) */}
              <Grid size={{ xs: 12 }}>
                <Typography variant='body1'>
                  <strong>Selected Courses:</strong>{' '}
                  {offer.selected_courses.map(course => course.title).join(', ') || 'N/A'}
                </Typography>
                {/* In a real app, you'd use a multi-select dropdown to update selected_courses */}
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
                          alt='Offer Image'
                          sx={{ width: 60, height: 40, objectFit: 'cover' }}
                        />
                      )}
                      <MediaUploader
                        label='Select Offer Image'
                        mediaType='image'
                        onUpload={async file => {
                          const result = await uploadOfferImage(file)

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

export default EditOffer
