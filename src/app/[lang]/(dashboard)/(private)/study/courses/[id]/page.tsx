'use client'
import React from 'react'

import Grid from '@mui/material/Grid2'
import { useQuery } from '@tanstack/react-query'
import { Typography, Box, Chip, Rating, Avatar, Paper, Card, CardMedia, Stack } from '@mui/material'

import { getCourse } from '@/data/courses/coursesQuery'
import StatusChanger from '@/components/form-fields/StatusChanger'
import DetailsSkeleton from '@/components/DetaileSkeleton'
import PageHeader from '@/components/PageHeader'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function ShowCourse({ params }: { params: { id: number } }) {
  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', params.id],
    queryFn: () => getCourse(params.id)
  })

  const courseData = course?.data

  if (isCourseLoading) {
    return <DetailsSkeleton />
  }

  if (!courseData) {
    return (
      <Typography variant='h5' textAlign='center' mt={4}>
        Course not found
      </Typography>
    )
  }

  return (
    <AnimationContainer>
      <PageHeader
        title={`Courses`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'courses', href: '/study/courses' },
          { label: courseData.title_en }
        ]}
        showBackButton={true}

      />

      <Grid container spacing={6}>
        {/* Course Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardMedia
              component='img'
              height='400'
              image={courseData.image}
              alt={courseData.title_en}
              sx={{ borderRadius: 1 }}
            />
          </Card>
        </Grid>

        {/* Course Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/* Title and Status */}
            <div>
              <Typography variant='h3' gutterBottom>
                {courseData.title_en || courseData.title_ar}
              </Typography>
              {/* Speciality and Status */}
              <Box display='flex' gap={2} mb={2}>
                <Typography variant='button' gutterBottom>
                  speciality : {courseData.speciality}
                </Typography>
              </Box>
              <Box display='flex' gap={2} mb={2}>
                <Chip
                  label={courseData.is_active ? 'Active' : 'Inactive'}
                  color={courseData.is_active ? 'success' : 'error'}
                  variant='filled'
                />
              </Box>
              <Typography variant='button' gutterBottom>
                Change Status : <StatusChanger row={courseData} type='course' />
              </Typography>
            </div>

            {/* Pricing */}
            <div>
              {courseData.price_after_discount ? (
                <div>
                  <Typography variant='h4' component='span' sx={{ mr: 2, color: 'success.main' }}>
                    ${courseData.price_after_discount}
                  </Typography>
                  <Typography
                    variant='body1'
                    component='span'
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ${courseData.price}
                  </Typography>
                </div>
              ) : (
                <Typography variant='h4'>${courseData.price}</Typography>
              )}
            </div>

            {/* Course Metadata */}
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography variant='body2' color='text.secondary'>
                Expires : {new Date(courseData.expire_date).toLocaleDateString()}
              </Typography>
            </Stack>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography variant='body2' color='text.secondary'>
                Rating :
              </Typography>
              <Rating value={courseData.rate} readOnly precision={0.5} />
            </Stack>

            {/* Statistics Grid */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant='h6'>{courseData.lectures_count}</Typography>
                  <Typography variant='caption'>Lectures</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant='h6'>{courseData.notes_count}</Typography>
                  <Typography variant='caption'>Notes</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant='h6'>{courseData.questions_count}</Typography>
                  <Typography variant='caption'>Questions</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant='h6'>{courseData.flash_cards_count}</Typography>
                  <Typography variant='caption'>Flashcards</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Description */}
            <div>
              <Typography variant='h6' gutterBottom>
                Description
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                {courseData.description_en || courseData.description_ar}
              </Typography>
            </div>

            {/* Admin Info */}
            <Paper variant='outlined' sx={{ p: 2 }}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Avatar sx={{ bgcolor: 'primary.main' }}>RH</Avatar>
                <div>
                  <Typography variant='subtitle2'>Course Admin</Typography>
                  <Typography variant='body2'>{courseData.admin_name}</Typography>
                </div>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </AnimationContainer>
  )
}
