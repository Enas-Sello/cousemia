'use client'
import React, { useState } from 'react'

import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import CourseCategory from '@/views/courses/category/Category'
import PageHeader from '@/components/PageHeader'

export default function CategoriesList() {
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)

  return (
    <AnimationContainer>
      <PageHeader title='Category' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Category' }]} />
      <FiltersDataInput
        courseId={courseId}
        categoryId={categoryId}
        setCourseId={setCourseId}
        setCategoryId={setCategoryId}
      />
      <CourseCategory courseId={courseId} categoryId={categoryId} />
    </AnimationContainer>
  )
}
