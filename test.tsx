// app/(user)/study/questions/add/page.tsx
'use client'

import React, { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'

import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import { addNewQuestion } from '@/data/courses/questionsQuery'
import { uploadAudio } from '@/data/media/mediaQuery'
import type { NewQuestionFormData } from '@/types/questionType'
import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import Loading from '@/components/loading'
import ImageUploadField from '@/components/form-fields/ImageUploadField'
import AudioUploadField from '@/components/form-fields/AudioUploadField'
import { QuestionFormSchema } from '@/schema/questionSchema/questionSchema'
import AnswersSection from '@/components/form-fields/AnswersSection'
import BasicFields from '@/components/form-fields/BasicFields'

export default function AddQuestionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Get IDs from query parameters
  const categoryId = parseInt(searchParams.get('categoryId') || '0', 10)
  const courseId = parseInt(searchParams.get('courseId') || '158', 10)
  const subCategoryId = parseInt(searchParams.get('subCategoryId') || '0', 10)

  // State for recording
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)

  // React Hook Form setup with Valibot validation
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<NewQuestionFormData>({
    resolver: valibotResolver(QuestionFormSchema),
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

  // Watch fields
  const voiceType = watch('voice_type')
  const imageUrl = watch('image_url')
  const explanationImageUrl = watch('explanation_image_url')

  // Set IDs when the component mounts
  useEffect(() => {
    if (categoryId) setValue('category_id', categoryId)
    if (courseId) setValue('course_id', courseId)
    if (subCategoryId) setValue('sub_category_id', subCategoryId)
  }, [categoryId, courseId, subCategoryId, setValue])

  // Upload audio mutation
  const uploadAudioMutation = useMutation({
    mutationFn: (file: File) => uploadAudio(file, 'notes'),
    onSuccess: (path) => {
      setValue('explanation_voice_path', path)
    },
    onError: () => {
      toast.error('Failed to upload audio. Please try again.')
    }
  })

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
    mutationFn: (data: NewQuestionFormData) => {
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
          file: null
        }
      }

      return addNewQuestion(payload)
    },
    onSuccess: () => {
      toast.success('Question created successfully')
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      router.push('/study/questions')
    },
    onError: () => {
      toast.error('Failed to create question. Please try again.')
    }
  })

  // Handle form submission
  const onSubmit = (formData: NewQuestionFormData) => {
    createMutation.mutate(formData)
  }

  return (
    <Card>
      <CardHeader title="Add New Question" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* Basic Fields */}
            <BasicFields control={control} errors={errors} description />

            {/* Question Image */}
            <Grid size={{ xs: 12 }}>
              <Typography>Question Image</Typography>
              <ImageUploadField
                control={control}
                fieldName="image_url"
                fieldId="image"
                initialImageUrl={imageUrl || null}
                setValue={setValue}
                label=""
              />
            </Grid>

            {/* Answers Section */}
            <Grid size={{ xs: 12 }}>
              <AnswersSection
                control={control}
                fields={fields}
                append={append}
                remove={remove}
                watch={watch}
                errors={errors}
              />

            </Grid>
            {/* Explanation Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="explanation_en"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="English Explanation"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="explanation_ar"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="Arabic Explanation"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            {/* Explanation Image */}
            <Grid size={{ xs: 12 }}>
              <Typography>Explanation Image</Typography>
              <ImageUploadField
                control={control}
                fieldName="explanation_image_url"
                fieldId="explanation_image"
                initialImageUrl={explanationImageUrl || null}
                setValue={setValue}
                label=""
              />
            </Grid>

            {/* Audio Type Selection */}
            <Grid size={{ xs: 12 }}>
              <Typography>Choose Explanation Audio Type</Typography>
              <Controller
                name="voice_type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                  >
                    <FormControlLabel value="upload" control={<Radio />} label="Upload MP3 File" />
                    <FormControlLabel value="record" control={<Radio />} label="Record Voice" />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Conditional Audio Input */}
            {voiceType === 'upload' && (
              <Grid size={{ xs: 12 }}>
                <AudioUploadField
                  control={control}
                  fieldName="explanation_voice_path"
                  fieldId="explanation_voice"
                  setValue={setValue}
                  label="Upload MP3 File"
                />
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
                    variant="contained"
                    color={isRecording ? 'error' : 'primary'}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </Box>
              </Grid>
            )}

            {/* Filters */}
            <Grid size={{ xs: 12 }}>
              <FiltersDataInput
                courseId={watch('course_id')}
                categoryId={watch('category_id')}
                subCategoryId={watch('sub_category_id')}
                setCourseId={(id) => setValue('course_id', id ?? 0)}
                setCategoryId={(id) => setValue('category_id', id ?? 0)}
                setSubCategoryId={(id) => setValue('sub_category_id', id ?? 0)}
              />
            </Grid>

            {/* Is Free Content */}
            <Grid size={{ xs: 12 }}>
              <Typography>Is Free Content</Typography>
              <Controller
                name="is_free_content"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value ? 'yes' : 'no'}
                    onChange={e => field.onChange(e.target.value === 'yes')}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
            </Grid>

            {/* Submit and Cancel Buttons */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? <Loading /> : 'Submit'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => router.push('/study/questions')}
                >
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
