'use client'

import React from 'react'

import { Box, Typography, Chip, Paper, Divider, Stack, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid2'

import type { SubCategory } from '@/types/lectureType'

interface QuestionViewProps {
    question: {
        id: number
        admin_id: number
        course: string
        category: string
        sub_category: string
        subs: SubCategory[]
        title_en: string
        title_ar: string
        description_en?: string
        description_ar?: string
        explanation_en: string
        explanation_ar: string
        explanation_image: string
        explanation_voice: string
        answers: {
            id: number
            answer_en: string
            answer_ar: string
            is_correct: number
        }[]
        image?: string
        url?: string
        is_active: boolean
        is_free_content: boolean
        status: string
        created_by: string
        created_at: string
    }
}

const QuestionView: React.FC<{ question: QuestionViewProps['question'] }> = ({ question }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={4}>
                {/* Question Image */}
                {question.image && (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant='h6'>Question Image</Typography>
                                <Box
                                    component='img'
                                    src={question.image}
                                    alt='Question'
                                    sx={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', mt: 2 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Question Text */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Question (EN)</Typography>
                            <Typography>{question.title_en}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Question (AR)</Typography>
                            <Typography dir='rtl'>{question.title_ar}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Answers */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6' gutterBottom>Answers</Typography>
                            <Stack spacing={2}>
                                {question.answers.map((ans) => (
                                    <Paper
                                        key={ans.id}
                                        sx={{
                                            p: 2,
                                            borderLeft: `5px solid ${ans.is_correct ? '#4caf50' : '#ccc'}`
                                        }}
                                    >
                                        <Typography><strong>EN:</strong> {ans.answer_en}</Typography>
                                        <Typography dir='rtl'><strong>AR:</strong> {ans.answer_ar}</Typography>
                                        {ans.is_correct === 1 && (
                                            <Chip label='Correct' color='success' size='small' sx={{ mt: 1 }} />
                                        )}
                                    </Paper>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Explanation */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Explanation (EN)</Typography>
                            <Typography>{question.explanation_en}</Typography>
                            <Typography variant='h6'>Explanation (AR)</Typography>
                            <Typography dir='rtl'>{question.explanation_ar}</Typography>
                            {question.explanation_image && (
                                <Box
                                    component='img'
                                    src={question.explanation_image}
                                    alt='Explanation'
                                    sx={{ maxWidth: '100%', mt: 2 }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>

                            {question.explanation_voice && (
                                <Box mt={2}>
                                    <Typography variant='subtitle2'>Voice Explanation</Typography>
                                    <audio controls style={{ width: '100%' }}>
                                        <source src={question.explanation_voice} type='audio/mpeg' />
                                        Your browser does not support the audio element.
                                    </audio>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Meta Data */}
                <Grid size={{ xs: 12 }}>
                    <Stack spacing={2}>
                        <Box display='flex' gap={2} flexWrap='wrap'>
                            <Chip label={question.course} color='primary' />
                            <Chip label={question.category} color='secondary' />
                            <Chip label={question.sub_category} color='default' />
                            <Chip label={question.status} color={question.status === 'active' ? 'success' : 'warning'} />
                            <Chip label={question.is_free_content ? 'Free' : 'Paid'} color={question.is_free_content ? 'success' : 'warning'} />
                        </Box>
                        <Typography variant='body2'><strong>Created By:</strong> {question.created_by}</Typography>
                        <Typography variant='body2'><strong>Created At:</strong> {question.created_at}</Typography>
                    </Stack>
                </Grid>

                {/* Subcategories */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant='h6'>Related Subcategories</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {question.subs.map((sub) => (
                            <Grid key={sub.value} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Paper variant='outlined' sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant='body1'>{sub.label}</Typography>
                                    <Typography variant='caption' color='text.secondary'>{sub.parent_category}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default QuestionView
