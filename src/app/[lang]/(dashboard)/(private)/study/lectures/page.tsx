'use client'
import React, { useState } from 'react'

import Lectures from '@/views/lectures/lectures'
import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import PageHeader from '@/components/PageHeader'

export default function LectureList() {
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(undefined)

  return (
    <AnimationContainer>
      <PageHeader title='Lectures' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Lectures' }]} />
      <FiltersDataInput
        courseId={courseId}
        categoryId={categoryId}
        setCourseId={setCourseId}
        setCategoryId={setCategoryId}
        setSubCategoryId={setSubCategoryId}
      />
      <Lectures courseId={courseId} categoryId={categoryId} subCategoryId={subCategoryId} />
    </AnimationContainer>
  )
}
