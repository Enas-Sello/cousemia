'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import Grid from '@mui/material/Grid2'

import { toast } from 'react-toastify';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';

import type { NewQuestionFormData, updateQuestionType } from '@/types/questionType';
import BasicFields from '@/components/form-fields/BasicFields';
import AnswersSection from '@/components/form-fields/AnswersSection';
import ImageUploadField from '@/components/form-fields/ImageUploadField';
import FiltersDataInput from '@/components/form-fields/FiltersDataInput';
import { updateQuestion } from '@/data/question/questionsQuery';
import Explanation from '@/components/Explanation';
import SwitchFields from '@/components/form-fields/SwitchFields';

type EditQuestionProps = {
    data: updateQuestionType;
};

const EditQuestion = ({ data }: EditQuestionProps) => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<updateQuestionType>({
        defaultValues: {
            title_en: '',
            title_ar: '',
            description_en: '',
            description_ar: '',
            explanation_en: '',
            explanation_ar: '',
            explanation_image: null,
            explanation_voice: null,
            image: '',
            answers: [],
            is_active: false,
            is_free_content: 'false',
            course_id: 0,
            category_id: 0,
            sub_category_id: 0,
            voice_type: null,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'answers',
    });

    useEffect(() => {
        if (data) {
            const question = data;

            reset({
                title_en: question.title_en || '',
                title_ar: question.title_ar || '',
                description_en: question.description_en || '',
                description_ar: question.description_ar || '',
                explanation_en: question.explanation_en || '',
                explanation_ar: question.explanation_ar || '',
                explanation_image: question.explanation_image || null,
                explanation_voice: question.explanation_voice || null,
                image: question.image as string || '',
                answers: question.answers?.map(ans => ({
                    ...ans,
                    is_correct: Boolean(ans.is_correct), // force to true/false
                })) || [],
                is_active: question.is_active,
                is_free_content: question.is_free_content,
                course_id: question.course_id || 0,
                category_id: question.category_id || 0,
                sub_category_id: question.sub_category_id || 0,
            });
        }
    }, [data, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (updatedData: any) => {

            if (data?.id === undefined) {
                throw new Error('Lecture ID is undefined')
            }

            console.log('Updated Data:', updatedData)

            return updateQuestion(data?.id, updatedData)
        },
        onSuccess: () => {
            toast.success('Question updated successfully');
            router.push('/study/questionsAnswer');
        },
        onError: () => {
            toast.error('Failed to update question. Please try again.');
        },
    });

    const onSubmit = (formData: NewQuestionFormData) => {
        const payload = {
            ...formData,
            answers: formData.answers.map((answer: any) => ({
                ...answer,
                is_correct: answer.is_correct ? '1' : '0',
            }))
        }

        mutate(payload);
    };

    if (!data) return null;

    return (
        <Card>
            <CardHeader title="Edit Question" />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={6}>
                        {/* Basic Fields */}
                        <BasicFields control={control} errors={errors} description />

                        {/* Question Image */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography>Question Image</Typography>
                            <ImageUploadField
                                control={control}
                                fieldName="image"
                                fieldId="image_id"
                                initialImageUrl={typeof watch('image') === 'string' ? watch('image') : ''}
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
                            explanationImageUrl={
                                typeof watch('explanation_image') === 'string'
                                    ? watch('explanation_image')
                                    : null
                            }
                        />

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
                        <SwitchFields control={control} />

                        {/* Submit and Cancel Buttons */}
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="contained" type="submit" disabled={isPending}>
                                    {isPending ? 'Updating...' : 'Update'}
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
    );
};

export default EditQuestion;
