'use client'
import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, boolean, minLength } from 'valibot'
import { toast } from 'react-toastify'
import { Typography, Card, CardContent, Switch, Button, CircularProgress, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { getCountryByID, updateCountry } from '@/data/countries/countriesQuery'
import CustomTextField from '@/@core/components/mui/TextField'

// Form data type
type FormDataType = {
  title_en: string
  title_ar: string
  country_code: string
  is_active: boolean
  flag: File | null
  flag_url: string
  flag_id: string
}

// Valibot schema for validation
const schema = object({
  title_en: string([minLength(1, 'This field is required')]),
  title_ar: string(),
  country_code: string([minLength(1, 'This field is required')]),
  is_active: boolean()
})

const EditCountry = () => {
  const { id } = useParams() // Get the country ID from the URL
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch country data
  const {
    data: countryResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ['country', id],
    queryFn: () => getCountryByID(id as string),
    enabled: !!id
  })

  const country = countryResponse?.data

  // Form setup
  const { control, handleSubmit, reset } = useForm<FormDataType>({
    resolver: valibotResolver(schema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      country_code: '',
      is_active: false,
      flag: null,
      flag_url: '',
      flag_id: ''
    }
  })

  // Populate form with fetched data
  useEffect(() => {
    if (country) {
      reset({
        title_en: country.title_en,
        title_ar: country.title_ar,
        country_code: country.country_code,
        is_active: country.is_active,
        flag: null,
        flag_url: country.flag,
        flag_id: ''
      })
    }
  }, [country, reset])

  // const flagUrl = watch('flag_url')

  // Mutation for updating the country
  const updateMutation = useMutation({
    mutationFn: (data: FormDataType) => {
      const payload = {
        id: Number(id),
        title_en: data.title_en,
        title_ar: data.title_ar,
        country_code: data.country_code,
        is_active: data.is_active,
        flag: data.flag_url,
        flag_id: data.flag_id
      }

      return updateCountry(payload)
    },
    onSuccess: response => {
      toast.success(response.message || 'Country updated successfully')
      queryClient.invalidateQueries({ queryKey: ['country', id] })
      queryClient.invalidateQueries({ queryKey: ['countries'] }) // Update the countries list if needed
      router.push(`/utilitie/countries`)
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update country')
    }
  })

  // Handle form submission
  const onSubmit = (data: FormDataType) => {
    updateMutation.mutate(data)
  }

  // Handle form reset
  const handleReset = () => {
    reset({
      title_en: country?.title_en || '',
      title_ar: country?.title_ar || '',
      country_code: country?.country_code || '',
      is_active: country?.is_active || false,
      flag: null,
      flag_url: country?.flag || '',
      flag_id: ''
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
          Error: {error.message || 'Failed to load country details'}
        </Typography>
      </Box>
    )
  }

  // Handle case where country is not found
  if (!country) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6'>Country not found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Edit Country
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
                      label='Title En'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {/* Title AR */}
                <Controller
                  name='title_ar'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Title Ar'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Controller
                  name='country_code'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <CustomTextField
                      {...field}
                      label='Country Code'
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

              {/* Flag Upload */}
              {/* <Grid size={{ xs: 12 }}> 
              <Controller
              name='flag'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {flagUrl && (
                    <Box
                      component='img'
                      src={flagUrl}
                      alt='Country Flag'
                      sx={{ width: 60, height: 40, objectFit: 'cover' }}
                    />
                  )}
                  <MediaUploader
                    label='Select Country Flag'
                    mediaType='image'
                    onUpload={async file => {
                      const result = await uploadCountryFlag(file)

                      field.onChange(file)
                      setValue('flag_url', result.url)
                      setValue('flag_id', result.id || '')

                      return result
                    }}
                    value={flagUrl}
                    onChange={url => {
                      setValue('flag_url', url || '')
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

export default EditCountry
