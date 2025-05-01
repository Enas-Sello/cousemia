// app/(user)/study/questions/add/page.tsx
'use client'

import React, { useEffect } from 'react'

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

import { CustomTextFieldRadio } from '@/@core/components/mui/TextField'
import { addNewQuestion } from '@/data/question/questionsQuery'
import type { NewQuestionFormData } from '@/types/questionType'
import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import Loading from '@/components/loading'
import ImageUploadField from '@/components/form-fields/ImageUploadField'
import AudioUploadField from '@/components/form-fields/AudioUploadField'
import { QuestionFormSchema } from '@/schema/questionSchema/questionSchema'
import AnswersSection from '@/components/form-fields/AnswersSection'
import BasicFields from '@/components/form-fields/BasicFields'
import { getFieldError } from '@/utils/forms'
import AudioRecordField from '@/components/form-fields/AudioRecorderField'
import Explanation from '@/components/Explanation'

export default function AddQuestionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Get IDs from query parameters
  const courseId = parseInt(searchParams.get('courseId') || '0')
  const categoryId = parseInt(searchParams.get('categoryId') || '0')
  const subCategoryId = parseInt(searchParams.get('subCategoryId') || '0')


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
      explanation_image: null,
      explanation_image_id: undefined,
      explanation_voice: null,
      voice_type: null,
      answers: [{ answer_en: '', answer_ar: '', is_correct: false, showArabicAnswer: true }],
      category_id: categoryId || undefined,
      course_id: courseId || undefined,
      sub_category_id: subCategoryId || undefined,
      is_free_content: ''
    }
  })

  // Use useFieldArray to manage dynamic answers
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers'
  })

  // Watch fields
  const voiceType = watch('voice_type')
  const imageUrl = watch('image')
  const explanationImageUrl = watch('explanation_image')

  useEffect(() => {
    if (categoryId) setValue('category_id', categoryId)
    if (courseId) setValue('course_id', courseId)
    if (subCategoryId) setValue('sub_category_id', subCategoryId)
  }, [categoryId, courseId, subCategoryId, setValue])


  // Mutation to create a new question
  const createMutation = useMutation({
    mutationFn: (data: FormData) => addNewQuestion(data),
    onSuccess: () => {
      toast.success('Question created successfully')
      queryClient.invalidateQueries({ queryKey: ['questions'] })

      router.push('/study/questionsAnswer')
    },
    onError: () => {
      toast.error('Failed to create question. Please try again.')
    }
  })

  const onSubmit = (formData: NewQuestionFormData) => {
    console.log("Form data before submission:", formData);

    // Handle potential errors by scrolling to the first error field (if any)
    if (Object.keys(errors).length) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Prepare the payload in the required format
    const payload = {
      questionData: {
        title_en: formData.title_en,
        title_ar: formData.title_ar,
        description_en: formData.description_en || '',
        description_ar: formData.description_ar || '',
        explanation_en: formData.explanation_en,
        explanation_ar: formData.explanation_ar,
        explanation_voice: formData.explanation_voice || null,
        explanation_image: formData.explanation_image || null,
        explanation_image_id: formData.explanation_image_id || null,
        image: formData.image || null,
        image_id: formData.image_id || null,
        voice_type: formData.voice_type === 'upload' ? '1' : formData.voice_type === 'record' ? '2' : '0',
        course_id: formData.course_id?.toString() || '',
        category_id: formData.category_id?.toString() || '',
        sub_category_id: formData.sub_category_id?.toString() || '',
        answers: formData.answers.map(answer => ({
          answer_en: answer.answer_en,
          answer_ar: answer.showArabicAnswer ? answer.answer_ar : '',
          is_correct: answer.is_correct ? '1' : '0'
        })),
        is_free_content: formData.is_free_content ? '1' : '0',
        file: null
      }
    } as unknown as FormData;


    console.log('Submitting payload:', payload);
    createMutation.mutate(payload);
  };

  useEffect(() => {
    console.error('errors', errors);
  }, [errors]);


  return (
    <Card>
      <CardHeader title="Add New Question" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* Basic Fields */}
            <BasicFields control={control} errors={errors} description />

            {/* Question Image */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography>Question Image</Typography>
              <ImageUploadField
                control={control}
                fieldName="image"
                fieldId="image_id"
                initialImageUrl={typeof imageUrl === 'string' ? imageUrl : null}
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
            <Explanation control={control}
              setValue={setValue}
              explanationImageUrl={explanationImageUrl} />


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
                  fieldName="explanation_voice"
                  setValue={setValue}
                  initialAudioUrl={watch('explanation_voice')}
                  label="Upload MP3 File"
                  route={'notes'} />
              </Grid>
            )}

            {voiceType === 'record' && (
              <Grid size={{ xs: 12 }}>
                <AudioRecordField
                  control={control}
                  fieldName="explanation_voice"
                  setValue={setValue}
                  route={'notes'}
                  initialAudioUrl={watch('explanation_voice')}
                  label="Record Explanation"
                />

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
              <Controller
                name='is_free_content'
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <CustomTextFieldRadio
                    {...field}
                    label='Is Free?'
                    options={[
                      { value: '1', label: 'Yes' },
                      { value: '0', label: 'No' }
                    ]}
                    value={field.value ?? ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(event.target.value)
                    }}
                    {...getFieldError(errors, 'is_free_content')}

                  />
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
                  onClick={() => router.push('/study/questionsAnswer')}
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
