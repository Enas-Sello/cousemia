'use client'

import React, { useEffect, useState } from 'react'

import { Button, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid2'

import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { API_COURSES } from '@/configs/api'
import AxiosRequest from '@/libs/axios.config'
import type { CourseFormType } from '@/types/courseType'

type Props = {
  id: number
}

export default function CourseUpdateForm({ id }: Props) {
  const [initialValues, setInitialValues] = useState<CourseFormType | undefined>(undefined)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset // Add reset here
  } = useForm<CourseFormType>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await AxiosRequest.get(`${API_COURSES}/${id}`)
      const courseData = response.data.data as CourseFormType

      setInitialValues(courseData)
      reset(courseData) // Reset the form with fetched data
    }

    fetchData()
  }, [id, reset]) // Include reset in the dependency array

  if (!initialValues) {
    return <div>Loading...</div> // Or a loading spinner
  }

  const onSubmit = () => {
    ;('update')
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='title_en'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <CustomTextField {...field} fullWidth label='Title En' />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='title_ar'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <CustomTextField {...field} fullWidth label='Title AR' />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='description_en'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth rows={8} multiline label='Description EN' />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='description_ar'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth rows={8} multiline label='Description AR' />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
