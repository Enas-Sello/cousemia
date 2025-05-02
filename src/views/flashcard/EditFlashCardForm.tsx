// components/EditFlashCardForm.tsx
'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useForm, Controller } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2'

import { toast } from 'react-toastify';

import CustomTextField from '@/@core/components/mui/TextField';
import FiltersDataInput from '@/components/form-fields/FiltersDataInput';
import SwitchFields from '@/components/form-fields/SwitchFields';
import { updateFlashCard } from '@/data/flashCards/flashCardsQuery';
import type { FlashCardType, FlashCardsDataType } from '@/types/flashCardType';
import { FlashCardSchema } from '@/schema/flascards/flashCardSchema';
import ErrorBox from '@/components/ErrorBox';

interface EditFlashCardFormProps {
    flashCard: FlashCardType;
}

const EditFlashCardForm: React.FC<EditFlashCardFormProps> = ({ flashCard }) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FlashCardsDataType>({
        defaultValues: {
            front_en: '',
            front_ar: '',
            back_en: '',
            back_ar: '',
            course_id: '',
            category_id: '',
            sub_category_id: null,
            is_free_content: false,
            is_active: false,
        },
        resolver: valibotResolver(FlashCardSchema),
        mode: 'onChange',
    });

    const courseId = watch('course_id')
    const categoryId = watch('category_id')
    const subCategoryId = watch('sub_category_id')


    useEffect(() => {
        if (flashCard) {
            reset({
                front_en: flashCard.front_en || '',
                front_ar: flashCard.front_ar || '',
                back_en: flashCard.back_en || '',
                back_ar: flashCard.back_ar || '',
                course_id: flashCard.course_id || undefined,
                category_id: flashCard.category_id || undefined,
                sub_category_id: flashCard.sub_category_id || undefined,
                is_free_content: Boolean(flashCard.is_free_content),
                is_active: Boolean(flashCard.is_active),
            });
        }
    }, [flashCard, reset]);

    const { mutate, isPending, error } = useMutation({
        mutationFn: (formData: FlashCardsDataType) => {
            console.log('formData', formData)
            const data = new FormData();

            data.append('front_en', formData.front_en);
            data.append('front_ar', formData.front_ar);
            data.append('back_en', formData.back_en);
            data.append('back_ar', formData.back_ar);
            data.append('course_id', formData.course_id.toString());
            data.append('category_id', formData.category_id.toString());
            if (formData.sub_category_id)
                data.append('sub_category_id', formData.sub_category_id.toString());
            data.append('is_free_content', formData.is_free_content ? '1' : '0');
            console.log('formData.is_active', formData.is_active)

            if (formData.is_active !== undefined) {
                data.append('is_active', formData.is_active.toString());
            }

            return updateFlashCard(flashCard.id, data);
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['flashCard', flashCard.id] });
            queryClient.invalidateQueries({ queryKey: ['flashCards'] });
            toast.success('Lecture updated successfully')
            router.push('/study/flashCards');
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message || 'Failed to update lecture.')
        },
    });

    const onSubmit = (formData: FlashCardsDataType) => {
        mutate(formData);
    };

    if (!flashCard) return <ErrorBox error={error} />

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={6}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name='front_en'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Front (English)'
                                        error={!!errors.front_en}
                                        helperText={errors.front_en?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name='front_ar'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Front (Arabic)'
                                        error={!!errors.front_ar}
                                        helperText={errors.front_ar?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name='back_en'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Back (English)'
                                        error={!!errors.back_en}
                                        helperText={errors.back_en?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name='back_ar'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Back (Arabic)'
                                        error={!!errors.back_ar}
                                        helperText={errors.back_ar?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FiltersDataInput
                                courseId={courseId as number}
                                categoryId={categoryId as number}
                                subCategoryId={subCategoryId as number}
                                setCourseId={(id) => setValue('course_id', id as number)}
                                setCategoryId={(id) => setValue('category_id', id as number)}
                                setSubCategoryId={(id) => setValue('sub_category_id', id)}
                                drawer
                            />
                        </Grid>
                        <SwitchFields control={control} />
                        <Grid size={{ xs: 12 }}
                            className='flex gap-4 flex-wrap'>
                            <Button
                                variant='contained'
                                type='submit'
                                disabled={isPending}
                            >
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>

                            <Button
                                variant='outlined'
                                onClick={() => router.push('/study/flashCards')}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default EditFlashCardForm;
