import { useEffect, useMemo, useRef } from 'react'

import dynamic from 'next/dynamic'

import 'react-quill/dist/quill.snow.css'
import { Box, Typography, Button, Divider } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { EditorResponse, FormDataType } from '@/types/editor'
import { editorSchema } from '@/schema/editorSchema/editorSchema'
import { useQuillImageUpload } from '@/libs/helpers/useQuillImageUpload'
import Loading from './loading'

// Quill modules and formats for the toolbar
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
}

const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'align', 'list', 'bullet', 'link', 'image']

export default function RichTextEditor({
  editorData,
  updateFunction,
  queryKey
}: {
  editorData: EditorResponse
  updateFunction: (data: FormDataType) => Promise<EditorResponse>
  queryKey: string
}) {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import('react-quill'), {
        ssr: false,
        loading: () => <Loading />
      }),
    []
  )

  const queryClient = useQueryClient()

  const quillRef = useRef<any>(null)

  // Form setup
  const {
    control,
    handleSubmit,
    reset,

    //@ts-expect-error
    formState: { errors }
  } = useForm<FormDataType>({ resolver: valibotResolver(editorSchema), defaultValues: { content: '' } })

  // Populate form with fetched data
  useEffect(() => {
    if (editorData) {
      reset({ content: editorData.data.content })
    }
  }, [editorData, reset])

  // Mutation for updating content
  const updateMutation = useMutation({
    mutationFn: (data: FormDataType) => updateFunction(data),
    onSuccess: (response: EditorResponse) => {
      toast.success(response.message || 'Content updated successfully')
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update content')
    }
  })

  // Handle form submission
  const onSubmit = (data: FormDataType) => {
    updateMutation.mutate(data)
  }

  // Handle form reset
  const handleReset = () => {
    reset({ content: editorData?.data.content || '' })
  }

  // Custom hook for image upload
  useQuillImageUpload(quillRef)

  return (
    <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant='h5' gutterBottom>
        Current About Us Content
      </Typography>
      <Box
        sx={{
          minHeight: '100px',
          p: 2,
          mb: 4
        }}
      >
        {editorData?.data.content ? (
          <div dangerouslySetInnerHTML={{ __html: editorData.data.content }} />
        ) : (
          <Typography color='text.secondary'>No content available.</Typography>
        )}
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Typography variant='h5' gutterBottom>
        Edit About Us Content
      </Typography>
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <ReactQuill
            theme='snow'
            value={field.value}
            onChange={field.onChange}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            style={{ height: '300px', marginBottom: '40px' }}
            
            //@ts-expect-error
            ref={quillRef}
          />
        )}
      />
      {errors.content && (
        <Typography color='error' variant='body2'>
          {errors.content.message}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
        <Button
          disabled={updateMutation.isPending}
          type='submit'
          variant='contained'
          sx={{ backgroundColor: '#e91e63', '&:hover': { backgroundColor: '#d81b60' }, flex: 1 }}
        >
          {updateMutation.isPending ? 'Saving...' : 'Submit'}
        </Button>
        <Button
          disabled={updateMutation.isPending}
          type='button'
          variant='outlined'
          onClick={handleReset}
          sx={{ flex: 1 }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  )
}
