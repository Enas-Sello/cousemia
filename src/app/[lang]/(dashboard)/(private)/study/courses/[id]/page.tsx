// 'use client'
import React from 'react'

import Grid from '@mui/material/Grid2'

import CourseOverview from '@/views/courses/lectures/overview'
import Lectures from '@/views/courses/lectures/lectures'
import FlashCard from '@/views/courses/flashcard/FlashCards'
import Question from '@/views/courses/question/Question'
import Category from '@/views/courses/category/Category'
import SubCategory from '@/views/courses/category/SubCategory'
import Image from '@/views/courses/Image'
import Notes from '@/views/courses/note/Notes'

export default function ShowCourse({ params }: { params: { id: number } }) {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CourseOverview courseId={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Lectures id={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FlashCard id={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Notes id={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Question id={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Category id={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SubCategory id={params.id} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Image id={params.id} />
      </Grid>
    </Grid>
  )
}
