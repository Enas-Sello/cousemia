'use client'
import React from 'react'

import CourseUpdateForm from './CourseUpdateForm'

export default function EditCourse({ params }: { params: { id: number } }) {
  return <CourseUpdateForm id={params.id} />
}
