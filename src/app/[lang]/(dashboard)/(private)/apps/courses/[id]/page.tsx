// 'use client'
import React from 'react'

import { Grid } from '@mui/material'

import CourseOverview from '@/views/courses/lectures/overview'
import Lectures from '@/views/courses/lectures/lectures'
import FlashCard from '@/views/courses/flashcard/flashcard'
import Notes from '@/views/courses/note/Note'
import Question from '@/views/courses/question/Question'
import Category from '@/views/courses/category/Category'
import SubCategory from '@/views/courses/category/SubCategory'
import Image from '@/views/courses/Image'

export default function ShowCourse({ params }: { params: { id: number } }) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <CourseOverview courseId={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <Lectures id={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <FlashCard id={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <Notes id={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <Question id={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <Category id={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <SubCategory id={params.id} />
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <Image id={params.id} />
      </Grid>
    </Grid>
  )
}
