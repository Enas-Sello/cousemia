// components/form-fields/AnswerField.tsx
'use client'

import { Controller } from 'react-hook-form'
import {
    Box,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Switch,
} from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import { getFieldError } from '@/utils/forms'

interface AnswerFieldProps {
    control: any
    index: number
    remove: (index: number) => void
    watch: any
    errors: any
}

const AnswerField = ({ control, index, remove, watch, errors }: AnswerFieldProps) => {
    return (
        <Box sx={{ p: 3, border: '1px solid #eee', borderRadius: 1, mb: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                <Controller
                    name={`answers.${index}.answer_en`}
                    control={control}
                    render={({ field }) => (
                        <CustomTextField
                            {...field}
                            label={`English Answer ${index + 1}`}
                            fullWidth
                            {...getFieldError(errors, `answers.${index}.answer_en`)}
                        />
                    )}
                />

                <Controller
                    name={`answers.${index}.showArabicAnswer`}
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
                            label="Add Arabic Answer"
                        />
                    )}
                />

                {watch(`answers.${index}.showArabicAnswer`) && (
                    <Controller
                        name={`answers.${index}.answer_ar`}
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                label={`Arabic Answer ${index + 1}`}
                                fullWidth
                                {...getFieldError(errors, `answers.${index}.answer_ar`)}
                            />
                        )}
                    />
                )}

                <Controller
                    name={`answers.${index}.is_correct`}
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            row
                            value={field.value ? 'yes' : 'no'}
                            onChange={e => field.onChange(e.target.value === 'yes')}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Correct Answer" />
                            <FormControlLabel value="no" control={<Radio />} label="Incorrect" />
                        </RadioGroup>
                    )}
                />
            </Box>

            <Button
                variant="contained"
                color="error"
                onClick={() => remove(index)}
                sx={{ mt: 2 }}
            >
                Remove Answer
            </Button>
        </Box>
    )
}

export default AnswerField
