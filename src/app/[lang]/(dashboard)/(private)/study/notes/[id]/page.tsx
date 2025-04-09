// app/study/notes/[id]/page.tsx
'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Chip, Divider, Link as MuiLink, Paper, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'

import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import { getNote } from '@/data/notes/notesQuery'
import PageHeader from '@/components/PageHeader'
import type { SubCategory } from '@/types/lectureType'

interface NoteViewProps {
  params: { id: string }
}

export default function NoteView({ params }: NoteViewProps) {
  const noteId = parseInt(params.id, 10)

  // Fetch the note using useQuery
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (isNaN(noteId)) {
        throw new Error('Invalid note ID')
      }

      return await getNote(noteId)
    }
  })

  const note = data?.data

  if (isLoading) {
    return <Loading />
  }

  if (error || !note) {
    return <ErrorBox refetch={refetch} error={error || new Error('Note not found')} />
  }

  return (
    <>
      <PageHeader
        title={`Note: ${note.title_en}`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Notes', href: '/study/notes' }, { label: note.title_en }]}
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
          {/* Note Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Title and Status */}
              <div>
                <Typography variant='h3' gutterBottom>
                  English Title: {note.title_en}
                </Typography>
                {note.title_ar && (
                  <Typography variant='h5' color='text.secondary' gutterBottom>
                    Arabic Title: {note.title_ar}
                  </Typography>
                )}
                <Box display='flex' gap={2} mb={2} flexWrap='wrap'>
                  <Chip label={note.category} color='primary' variant='outlined' />
                  <Chip label={note.sub_category} color='secondary' variant='outlined' />
                  <Chip label={note.status} color={note.status === 'active' ? 'success' : 'error'} variant='filled' />
                  <Chip
                    label={note.is_free_content ? 'Free Content' : 'Paid Content'}
                    color={note.is_free_content ? 'success' : 'warning'}
                    variant='filled'
                  />
                </Box>
              </div>

              {/* Course and Document URL */}
              <div>
                <Typography variant='body1' gutterBottom>
                  <strong>Course:</strong> {note.course || 'N/A'}
                </Typography>
                <Typography variant='body1'>
                  <strong>Document URL:</strong>{' '}
                  <MuiLink href={note.url} target='_blank' rel='noopener noreferrer' color='primary'>
                    View/Download PDF
                  </MuiLink>
                </Typography>
              </div>

              {/* Metadata */}
              <Paper variant='outlined' sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Created by:</strong> {note.created_by || 'N/A'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Created on:</strong> {note.created_at || 'N/A'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Admin ID:</strong> {note.admin_id || 'N/A'}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
          {/* Document Preview/Icon
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <IconFileTypePdf style={{ marginBottom: 2 }} />
                <Typography variant='h6' gutterBottom>
                  {note.title_en}
                </Typography>
                <MuiLink href={note.url} target='_blank' rel='noopener noreferrer' color='primary' variant='body1'>
                  View/Download PDF
                </MuiLink>
              </CardContent>
            </Card>
          </Grid> */}

          {/* Subcategories List */}
          <Grid size={{ xs: 12 }}>
            <Typography variant='h6' gutterBottom>
              Related Subcategories
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {note.subs && note.subs.length > 0 ? (
              <Grid container spacing={2}>
                {note.subs.map((sub: SubCategory) => (
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
