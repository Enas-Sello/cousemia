'use client'
import React from 'react'

import { useQuery } from '@tanstack/react-query'

import CourseUpdateForm from './CourseUpdateForm'
import { getCourse } from '@/data/courses/coursesQuery'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function EditCourse({ params }: { params: { id: number } }) {
  // Fetch course data using React Query
  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', params.id],
    queryFn: () => getCourse(params.id)
  })

  const courseData = course?.data

  return (

    <AnimationContainer>
  <CourseUpdateForm courseData={courseData} isCourseLoading={isCourseLoading} />
  </AnimationContainer>
  )
}
