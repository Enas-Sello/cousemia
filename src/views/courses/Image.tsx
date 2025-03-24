'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, Grid, IconButton } from '@mui/material'
import { useDropzone } from 'react-dropzone'

import { toast } from 'react-toastify'

import type { ImageType } from '@/types/imageType'
import {
  deleteCourseImage,
  getCourseImages,
  uploadCourseImage,
  uploadSingleCourseImage
} from '@/data/courses/coursesQuery'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function CourseImages({ id }: { id: number }) {
  const [data, setData] = useState<ImageType[]>([])
  const [imageUploading, setImageUploading] = useState(false)

  const fetchData = async (course: number) => {
    const result = await getCourseImages(course)

    setData(result)
  }

  useEffect(() => {
    fetchData(id)
  }, [id])

  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [deleteIndex, setDeleteIndex] = useState<number | undefined>(undefined)

  const deleteAction = async () => {
    const res = await deleteCourseImage(deleteIndex, id)

    if (res.status_code === 1) {
      toast.success('Image deleted successfully')
      setConfirmDialog(false)
    } else {
      toast.error('Delete action failed!')
    }

    fetchData(id)
  }

  const deleteConfirm = async (index: number) => {
    if (index > -1) {
      setConfirmDialog(true)
      setDeleteIndex(index)
    } else {
      toast.error('Image index is undefined!')
    }
  }

  const deleteDialogClose = () => {
    setDeleteIndex(undefined)
    setConfirmDialog(!confirmDialog)
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageUploading(true)

      try {
        const imageData = new FormData()

        imageData.append('name', 'my-pictures')

        acceptedFiles.forEach((file, index) => {
          imageData.append(`media[${index}]`, file)
        })

        const uploadResponse = await uploadCourseImage(imageData)
        const { data, status_code } = uploadResponse

        setData(prev => [...prev, ...data])

        if (status_code === 1) {
          const newImages: ImageType[] = data

          await uploadSingleCourseImage(newImages, id)
        }
      } catch (error) {
        console.error('Error during image upload:', error)
      } finally {
        setImageUploading(false)
      }
    }
  }

  const dropzoneCourseImage = useDropzone({
    accept: { 'image/*': [] }, // Only accept image files
    maxSize: 2097152, // Limit to 2 MB
    onDrop: files => onDrop(files),
    multiple: true
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Add/Remove Course Images' />
          <CardContent>
            <div
              {...dropzoneCourseImage.getRootProps({ className: 'dropzone' })}
              style={{
                border: '2px dashed',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <input {...dropzoneCourseImage.getInputProps()} />
              {dropzoneCourseImage.isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag & drop images here, or click to select files (max 2MB each)</p>
              )}
            </div>

            {imageUploading && <p className='mt-2 text-blue-600'>Uploading image(s)...</p>}

            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              {data.map((img: ImageType, index) => (
                <Grid item key={img.id} xs={12} sm={6} md={4} lg={3}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={img.url}
                      alt='Course Image'
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <IconButton
                      aria-label='delete'
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onClick={() => deleteConfirm(index)}
                    >
                      <i className='tabler-trash text-[22px] text-textSecondary' />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <ConfirmDialog
        handleAction={deleteAction}
        handleClose={deleteDialogClose}
        open={confirmDialog}
        closeText={'Cancel'}
      />
    </Grid>
  )
}
