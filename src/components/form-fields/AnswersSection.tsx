// components/form-sections/AnswersSection.tsx
'use client'

import { Button, Typography } from '@mui/material'

import AnswerField from '../form-fields/AnswerField'

interface AnswersSectionProps {
    control: any
    fields: any[]
    append: (obj: any) => void
    remove: (index: number) => void
    watch: any
    errors: any
}

const AnswersSection = ({ control, fields, append, remove, watch, errors }: AnswersSectionProps) => {
    const handleAddAnswer = () => {
        append({ answer_en: '', answer_ar: '', is_correct: false, showArabicAnswer: true })
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>Answers</Typography>
            {fields.map((field, index) => (
                <AnswerField
                    key={field.id}
                    control={control}
                    index={index}
                    remove={remove}
                    watch={watch}
                    errors={errors}
                />
            ))}
            <Button variant="outlined" onClick={handleAddAnswer} sx={{ width: 'fit-content' }}>
                Add Answer
            </Button>
        </>
    )
}

export default AnswersSection
