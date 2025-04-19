'use client'

import React from 'react'



import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import PageHeader from '@/components/PageHeader'
import CourseList from '@/views/courses/CoursesTable'




export default function CoursePage() {
  return (
    <AnimationContainer>
      <PageHeader title='Courses' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]} />{' '}
      <CourseList/>
    </AnimationContainer>
  )
}
