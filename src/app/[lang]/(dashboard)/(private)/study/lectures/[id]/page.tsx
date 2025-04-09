'use client'

import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import Grid from '@mui/material/Grid2'
import { Typography, Box, Chip, Paper, Card, CardMedia, Stack, Divider, Link, Tabs, Tab } from '@mui/material'

import StatusChanger from '@/components/StatusChanger'
import DetailsSkeleton from '@/components/DetaileSkeleton'
import { getLecture } from '@/data/lectures/lecturesQuery'
import type { SubCategory } from '@/types/lectureType'
import ErrorBox from '@/components/ErrorBox'
import PageHeader from '@/components/PageHeader'

export default function ShowLecture({ params }: { params: { id: number } }) {
  const [tabValue, setTabValue] = useState(0)

  // Fetch lecture data using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['lecture', params.id],
    queryFn: () => getLecture(params.id)
  })

  const lecture = data?.data

  // Handle loading state
  if (isLoading) {
    return <DetailsSkeleton />
  }

  // Handle error or no data state
  if (error || !lecture) {
    return <ErrorBox refetch={refetch} error={error} />
  }

  // Format the created_at field
  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(/ (am|pm)/i, ''))

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get YouTube embed URL for video preview
  const getVideoEmbedUrl = (url: string): string => {
    // Check if the URL is a YouTube URL
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]

      if (!videoId) {
        throw new Error('Invalid YouTube URL: Could not extract video ID.')
      }

      return `https://www.youtube.com/embed/${videoId}`
    }

    // Check if the URL is a Vimeo URL
    if (url.includes('vimeo.com')) {
      // For Vimeo URLs like https://player.vimeo.com/progressive_redirect/playback/836714574/...
      const match = url.match(/vimeo\.com\/(progressive_redirect\/playback\/)?(\d+)/)
      const videoId = match ? match[2] : null

      if (!videoId) {
        throw new Error('Invalid Vimeo URL: Could not extract video ID.')
      }

      return `https://player.vimeo.com/video/${videoId}`
    }

    // If the URL is not supported, throw an error
    throw new Error('Unsupported video URL: Only YouTube and Vimeo URLs are supported.')
  }

  // Handle tab change for descriptions
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <>
      <PageHeader
        title={`Lecture: ${lecture.title_en}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'lectures', href: '/study/lectures' },
          { label: lecture.title_en }
        ]}
        showBackButton={true}

        // actions={
        //   <Box sx={{ display: 'flex', gap: 2 }}>
        //     <Button variant='contained' color='primary' onClick={() => router.push(`/study/notes/edit/${note.id}`)}>
        //       Edit Note
        //     </Button>
        //     <Button variant='outlined' color='error' onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
        //       {deleteMutation.isPending ? 'Deleting...' : 'Delete Note'}
        //     </Button>
        //   </Box>
        // }
      />

      <Box sx={{ padding: { xs: 2, sm: 4 } }}>
        <Grid container spacing={6}>
          {/* Lecture Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardMedia
                component='img'
                height='400'
                image={lecture.image}
                alt={lecture.title_en}
                sx={{ borderRadius: 1, objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          {/* Lecture Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Title and Status */}
              <div>
                <Typography variant='h3' gutterBottom>
                  English title: {lecture.title_en}
                </Typography>
                <Typography variant='h5' color='text.secondary' gutterBottom>
                  Arabic title: {lecture.title_ar}
                </Typography>
                <Box display='flex' gap={2} mb={2} flexWrap='wrap'>
                  <Chip label={lecture.category} color='primary' variant='outlined' />
                  <Chip label={lecture.sub_category} color='secondary' variant='outlined' />
                  <Chip
                    label={lecture.is_active ? 'Active' : 'Inactive'}
                    color={lecture.is_active ? 'success' : 'error'}
                    variant='filled'
                  />
                  <Chip
                    label={lecture.is_free_content ? 'Free Content' : 'Paid Content'}
                    color={lecture.is_free_content ? 'success' : 'warning'}
                    variant='filled'
                  />
                </Box>
                <Typography variant='button' gutterBottom>
                  Change Status : <StatusChanger row={{ original: lecture }} type='Lecture' />
                </Typography>
              </div>

              {/* Course and Video URL */}
              <div>
                <Typography variant='body1' gutterBottom>
                  <strong>Course:</strong> {lecture.course}
                </Typography>
                <Typography variant='body1'>
                  <strong>Video URL:</strong>{' '}
                  <Link href={lecture.url} target='_blank' rel='noopener noreferrer' color='primary'>
                    Watch Video
                  </Link>
                </Typography>
              </div>

              {/* Descriptions with Tabs */}
              <div>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                  <Tab label='English Description' />
                  <Tab label='Arabic Description' />
                </Tabs>
                {tabValue === 0 && (
                  <>
                    <Typography variant='h6' gutterBottom>
                      Description (English)
                    </Typography>
                    <Typography variant='body1' color='text.secondary' paragraph>
                      {lecture.description_en || 'No description available.'}
                    </Typography>
                  </>
                )}
                {tabValue === 1 && (
                  <>
                    <Typography variant='h6' gutterBottom>
                      Description (Arabic)
                    </Typography>
                    <Typography variant='body1' color='text.secondary' paragraph>
                      {lecture.description_ar || 'No description available.'}
                    </Typography>
                  </>
                )}
              </div>

              {/* Metadata */}
              <Paper variant='outlined' sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Created by:</strong> {lecture.created_by}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Created on:</strong> {formatDate(lecture.created_at)}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Video Preview */}
          <Grid size={{ xs: 12 }}>
            <Typography variant='h6' gutterBottom>
              Video Preview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={getVideoEmbedUrl(lecture.url)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            </Box>
          </Grid>

          {/* Subcategories List */}
          <Grid size={{ xs: 12 }}>
            <Typography variant='h6' gutterBottom>
              Subcategories
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {lecture.subs.length > 0 ? (
              <Grid container spacing={2}>
                {lecture.subs.map((sub: SubCategory) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sub.value}>
                    <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant='body1'>{sub.label}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {sub.parent_category}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant='body2' color='text.secondary'>
                No subcategories available.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
