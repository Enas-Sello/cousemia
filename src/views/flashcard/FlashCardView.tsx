'use client'

import React from 'react'

import { Box, Typography, Chip, Divider, Paper, Stack, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid2'

import type { FlashCardViewProps } from '@/types/flashCardType'


const FlashCardView: React.FC<FlashCardViewProps> = ({ flashCard }) => {
    return (
        <Box sx={{ padding: { xs: 2, sm: 4 } }}>
            <Grid container spacing={6}>
                {/* Front/Back Content */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5' gutterBottom>Front (EN):</Typography>
                            <Typography variant='body1'>{flashCard.front_en}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant='h5' gutterBottom>Front (AR):</Typography>
                            <Typography variant='body1' dir='rtl'>{flashCard.front_ar}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5' gutterBottom>Back (EN):</Typography>
                            <Typography variant='body1'>{flashCard.back_en}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant='h5' gutterBottom>Back (AR):</Typography>
                            <Typography variant='body1' dir='rtl'>{flashCard.back_ar}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Metadata and Tags */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Box display='flex' gap={2} flexWrap='wrap'>
                            <Chip label={flashCard.course} color='primary' />
                            <Chip label={flashCard.category} color='secondary' />
                            <Chip label={flashCard.sub_category} color='default' />
                            <Chip
                                label={flashCard.status}
                                color={flashCard.status === 'active' ? 'success' : 'error'}
                            />
                            <Chip
                                label={flashCard.is_free_content ? 'Free' : 'Paid'}
                                color={flashCard.is_free_content ? 'success' : 'warning'}
                            />
                        </Box>

                        <Paper variant='outlined' sx={{ p: 2 }}>
                            <Typography variant='body2'><strong>Created By:</strong> {flashCard.created_by}</Typography>
                            <Typography variant='body2'><strong>Created At:</strong> {flashCard.created_at}</Typography>
                            <Typography variant='body2'><strong>Admin ID:</strong> {flashCard.admin_id}</Typography>
                        </Paper>
                    </Stack>
                </Grid>

                {/* Subcategories */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant='h6' gutterBottom>Related Subcategories</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {flashCard.subs.map((sub) => (
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

export default FlashCardView
