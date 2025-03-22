'use client'
import { useEffect, useRef } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength } from 'valibot'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Box, Typography, Button } from '@mui/material'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css' // Import Quill styles
import type { AboutUsResponse } from '@/data/aboutUS/aboutUSApi'
import { fetchAboutUsContent, updateAboutUsContent } from '@/data/aboutUS/aboutUSApi'

// Valibot schema for validation
const schema = object({
  content: string([minLength(1, 'This field is required')])
})

type FormDataType = {
  content: string
}

// Quill modules and formats for the toolbar
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
}

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'align', 'list', 'bullet', 'link', 'image']

const AboutUsEditor = () => {
  const queryClient = useQueryClient()
  const quillRef = useRef(null)

  // Fetch the initial "About Us" content
  const {
    data: aboutUsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['aboutUs'],
    queryFn: fetchAboutUsContent
  })

  console.log('aboutUsData', aboutUsData)

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormDataType>({
    resolver: valibotResolver(schema),
    defaultValues: {
      content: ''
    }
  })

  // Populate form with fetched data
  useEffect(() => {
    if (aboutUsData) {
      reset({ content: aboutUsData.data.content })
    }
  }, [aboutUsData, reset])

  // Mutation for updating the content
  const updateMutation = useMutation({
    mutationFn: (data: FormDataType) => updateAboutUsContent(data),
    onSuccess: (response: AboutUsResponse) => {
      toast.success(response.message || 'Content updated successfully')
      queryClient.invalidateQueries({ queryKey: ['aboutUs'] })
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
    reset({ content: aboutUsData?.data.content || '' })
  }

  // Handle image uploads
  useEffect(() => {
    if (quillRef.current) {
      console.log('uillRef.current', quillRef.current)
      const quill = quillRef.current.getEditor()

      quill.getModule('toolbar').addHandler('image', () => {
        const input = document.createElement('input')

        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
          if (!input.files) {
            toast.error('No file selected')

            return
          }

          const file = input.files[0]
          const formData = new FormData()

          formData.append('file', file)

          try {
            const response = await fetch('https://dev-api.coursemia.com/api/v1/en/admin/upload', {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            })

            const result = await response.json()
            const range = quill.getSelection()

            quill.insertEmbed(range.index, 'image', result.url)
          } catch (error) {
            toast.error('Failed to upload image')
          }
        }
      })
    }
  }, [])

  // Handle loading state
  if (isLoading) {
    return <Box>Loading...</Box>
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Error: {error.message || 'Failed to load About Us content'}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        About Us
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name='content'
          control={control}
          render={({ field }) => (
            <ReactQuill
              ref={quillRef}
              theme='snow'
              value={field.value}
              onChange={field.onChange}
              modules={modules}
              formats={formats}
              style={{ height: '300px', marginBottom: '40px' }} // Adjust height and margin for toolbar
            />
          )}
        />
        {errors.content && (
          <Typography color='error' variant='body2'>
            {errors.content.message}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type='submit'
            variant='contained'
            sx={{ backgroundColor: '#e91e63', '&:hover': { backgroundColor: '#d81b60' }, flex: 1 }}
          >
            Submit
          </Button>
          <Button type='button' variant='outlined' onClick={handleReset} sx={{ flex: 1 }}>
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AboutUsEditor
