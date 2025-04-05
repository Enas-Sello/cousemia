'use client'

import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography
} from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import { createQuestion } from '@/data/courses/questionsQuery'
import { uploadAudio, uploadImage } from '@/data/media/mediaQuery'

type Answer = {
  answer_en: string
  answer_ar?: string // Optional based on toggle
  is_correct: boolean
  showArabicAnswer: boolean // For toggle state (not sent to backend)
}

type FormData = {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  explanation_en: string
  explanation_ar: string
  image?: File | null
  image_id?: number // Store the uploaded image ID
  image_url?: string // Store the uploaded image URL
  explanation_image?: File | null
  explanation_image_id?: number // Store the uploaded explanation image ID
  explanation_image_url?: string // Store the uploaded explanation image URL
  explanation_voice?: File | null
  explanation_voice_path?: string // Store the uploaded audio path
  voice_type: 'upload' | 'record' | null
  answers: Answer[]
  category_id: number
  course_id: number
  sub_category_id?: number
  is_free_content: boolean
}

export default function AddQuestion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Get categoryId from query parameters
  const categoryId = parseInt(searchParams.get('categoryId') || '0', 10)

  console.log('🚀 ~ AddQuestion ~ categoryId:', categoryId)
  const courseId = parseInt(searchParams.get('courseId') || '158', 10) // Assuming courseId is passed or hardcoded for now
  const subCategoryId = parseInt(searchParams.get('subCategoryId') || '0', 10) || undefined

  // State for recording (for "Record Voice" option)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)

  // State for uploaded media metadata
  const [uploadedImage, setUploadedImage] = useState<{ id?: number; url?: string }>({})
  const [uploadedExplanationImage, setUploadedExplanationImage] = useState<{ id?: number; url?: string }>({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedExplanationVoice, setUploadedExplanationVoice] = useState<string | null>(null)

  // React Hook Form setup
  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      explanation_en: '',
      explanation_ar: '',
      image: null,
      image_id: undefined,
      image_url: undefined,
      explanation_image: null,
      explanation_image_id: undefined,
      explanation_image_url: undefined,
      explanation_voice: null,
      explanation_voice_path: undefined,
      voice_type: null,
      answers: [{ answer_en: '', answer_ar: '', is_correct: false, showArabicAnswer: true }],
      category_id: categoryId,
      course_id: courseId,
      sub_category_id: subCategoryId,
      is_free_content: false
    }
  })

  // Use useFieldArray to manage dynamic answers
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers'
  })

  // Watch fields to display file names and control conditional rendering
  const imageFile = watch('image')
  const explanationImageFile = watch('explanation_image')
  const voiceType = watch('voice_type')
  const explanationVoiceFile = watch('explanation_voice')

  // Set category_id, course_id, and sub_category_id when the component mounts
  useEffect(() => {
    if (categoryId) setValue('category_id', categoryId)
    if (courseId) setValue('course_id', courseId)
    if (subCategoryId) setValue('sub_category_id', subCategoryId)
  }, [categoryId, courseId, subCategoryId, setValue])

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onSuccess: (data, file) => {
      if (file === imageFile) {
        setUploadedImage({ id: data.id, url: data.url })
        setValue('image_id', data.id)
        setValue('image_url', data.url)
      } else if (file === explanationImageFile) {
        setUploadedExplanationImage({ id: data.id, url: data.url })
        setValue('explanation_image_id', data.id)
        setValue('explanation_image_url', data.url)
      }
    },
    onError: () => {
      toast.error('Failed to upload image. Please try again.')
    }
  })

  // Upload audio mutation
  const uploadAudioMutation = useMutation({
    mutationFn: (file: File) => uploadAudio(file, 'notes'),
    onSuccess: path => {
      setUploadedExplanationVoice(path)
      setValue('explanation_voice_path', path)
    },
    onError: () => {
      toast.error('Failed to upload audio. Please try again.')
    }
  })

  // Handle image file selection and upload
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'image' | 'explanation_image'
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      setValue(field, file)

      // Immediately upload the image
      uploadImageMutation.mutate(file)
    }
  }

  // Handle audio file upload
  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setValue('explanation_voice', file)

      // Immediately upload the audio
      uploadAudioMutation.mutate(file)
    }
  }

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = e => chunks.push(e.data)

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' })
        const file = new File([blob], `recording-${new Date().toISOString()}.mp3`, { type: 'audio/mp3' })

        setRecordedAudio(blob)
        setValue('explanation_voice', file)

        // Immediately upload the recorded audio
        uploadAudioMutation.mutate(file)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      toast.error('Failed to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  // Mutation to create a new question
  const createMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        questionData: {
          title_en: data.title_en,
          title_ar: data.title_ar,
          description_en: data.description_en,
          description_ar: data.description_ar,
          explanation_en: data.explanation_en,
          explanation_ar: data.explanation_ar,
          image_id: data.image_id || null,
          image: data.image_url || null,
          explanation_image_id: data.explanation_image_id || null,
          explanation_image: data.explanation_image_url || null,
          explanation_voice: data.explanation_voice_path || null,
          voice_type: data.voice_type === 'upload' ? '1' : data.voice_type === 'record' ? '2' : '0',
          answers: data.answers.map(answer => ({
            answer_en: answer.answer_en,
            answer_ar: answer.showArabicAnswer ? answer.answer_ar : '',
            is_correct: answer.is_correct ? '1' : '0'
          })),
          course_id: data.course_id,
          category_id: data.category_id || 179,
          sub_category_id: data.sub_category_id || '',
          is_free_content: data.is_free_content ? '1' : '0',
          file: null // No PDF in this component
        }
      }

      return createQuestion(payload)
    },
    onSuccess: () => {
      toast.success('Question created successfully')
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      router.push('/study/questions')
      reset()
    },
    onError: () => {
      toast.error('Failed to create question. Please try again.')
    }
  })

  // Handle form submission
  const onSubmit = (formData: FormData) => {
    createMutation.mutate(formData)
  }

  // Handle adding a new answer
  const handleAddAnswer = () => {
    append({ answer_en: '', answer_ar: '', is_correct: false, showArabicAnswer: true })
  }

  // Handle deleting an answer
  const handleDeleteAnswer = (index: number) => {
    remove(index)
  }

  return (
    <Card>
      <CardHeader title='Add New Question' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* English Title */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='title_en'
                control={control}
                rules={{ required: 'English Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label='English Title'
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {/* Arabic Title */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='title_ar'
                control={control}
                rules={{ required: 'Arabic Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label='Arabic Title'
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            {/* Description (English) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='description_en'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} label='English Description' fullWidth multiline rows={3} />
                )}
              />
            </Grid>
            {/* Description (Arabic) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='description_ar'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} label='Arabic Description' fullWidth multiline rows={3} />
                )}
              />
            </Grid>

            {/* Question Image */}
            <Grid size={{ xs: 12 }}>
              <Typography>Question Image</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    border: '1px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  {uploadedImage.url ? (
                    <img src={uploadedImage.url} alt='Question Image' style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <span>Choose Your Image</span>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#888' }}>Only images are accepted.</Typography>
                  <CustomTextField
                    type='text'
                    value={imageFile ? imageFile.name : 'Question Image'}
                    disabled
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button variant='outlined' component='label'>
                    Browse
                    <input type='file' accept='image/*' hidden onChange={e => handleImageChange(e, 'image')} />
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Dynamic Answers */}
            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={`answers.${index}.answer_en`}
                    control={control}
                    rules={{ required: 'English Answer is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomTextField
                        {...field}
                        label={`English Answer ${index + 1}`}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Is Correct Answer</Typography>
                    <Controller
                      name={`answers.${index}.is_correct`}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          value={field.value ? 'yes' : 'no'}
                          onChange={e => field.onChange(e.target.value === 'yes')}
                        >
                          <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                          <FormControlLabel value='no' control={<Radio />} label='No' />
                        </RadioGroup>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={`answers.${index}.showArabicAnswer`}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                        label='Add Arabic Answer'
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {watch(`answers.${index}.showArabicAnswer`) && (
                    <Controller
                      name={`answers.${index}.answer_ar`}
                      control={control}
                      rules={
                        watch(`answers.${index}.showArabicAnswer`) ? { required: 'Arabic Answer is required' } : {}
                      }
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          label={`Arabic Answer ${index + 1}`}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant='contained' color='error' onClick={() => handleDeleteAnswer(index)} sx={{ mt: 1 }}>
                    Delete Answer
                  </Button>
                </Grid>
              </React.Fragment>
            ))}

            {/* Add Answer Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant='contained'
                sx={{ backgroundColor: '#ff4081', '&:hover': { backgroundColor: '#f50057' } }}
                onClick={handleAddAnswer}
              >
                Add Answer
              </Button>
            </Grid>

            {/* Explanation Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='explanation_en'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} label='English Explanation' fullWidth multiline rows={3} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='explanation_ar'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} label='Arabic Explanation' fullWidth multiline rows={3} />
                )}
              />
            </Grid>

            {/* Choose Explanation Audio Type */}
            <Grid size={{ xs: 12 }}>
              <Typography>Choose Explanation Audio Type</Typography>
              <Controller
                name='voice_type'
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value}
                    onChange={e => field.onChange(e.target.value as 'upload' | 'record')}
                  >
                    <FormControlLabel value='upload' control={<Radio />} label='Upload MP3 File' />
                    <FormControlLabel value='record' control={<Radio />} label='Record Voice' />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Conditional Rendering for Audio Upload/Recording */}
            {voiceType === 'upload' && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <CustomTextField
                    type='text'
                    value={explanationVoiceFile ? explanationVoiceFile.name : 'Upload MP3 File'}
                    disabled
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button variant='outlined' component='label' className='mb-2'>
                    Browse
                    <input type='file' accept='audio/mp3' hidden onChange={handleAudioUpload} />
                  </Button>
                </Box>
              </Grid>
            )}

            {voiceType === 'record' && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {recordedAudio ? (
                    <audio controls src={URL.createObjectURL(recordedAudio)} />
                  ) : (
                    <Typography>No recording yet</Typography>
                  )}
                  <Button
                    variant='contained'
                    color={isRecording ? 'error' : 'primary'}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </Box>
              </Grid>
            )}

            {/* Explanation Image */}
            <Grid size={{ xs: 12 }}>
              <Typography>Explanation Image</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    border: '1px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  {uploadedExplanationImage.url ? (
                    <img
                      src={uploadedExplanationImage.url}
                      alt='Explanation Image'
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <span>Choose Your Image</span>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#888' }}>Only images are accepted.</Typography>
                  <CustomTextField
                    type='text'
                    value={explanationImageFile ? explanationImageFile.name : 'Explanation Image'}
                    disabled
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button variant='outlined' component='label'>
                    Browse
                    <input
                      type='file'
                      accept='image/*'
                      hidden
                      onChange={e => handleImageChange(e, 'explanation_image')}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Is Free Content */}
            <Grid size={{ xs: 12 }}>
              <Typography>Is Free Content</Typography>
              <Controller
                name='is_free_content'
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value ? 'yes' : 'no'}
                    onChange={e => field.onChange(e.target.value === 'yes')}
                  >
                    <FormControlLabel value='yes' control={<Radio />} label='Yes' />
                    <FormControlLabel value='no' control={<Radio />} label='No' />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Submit and Cancel Buttons */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type='submit' variant='contained' color='primary'>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={() => router.push('/study/questions')}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
