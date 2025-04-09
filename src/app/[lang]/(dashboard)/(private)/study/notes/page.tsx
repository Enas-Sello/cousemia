'use client'
import React, { useState } from 'react'

import FiltersDataInput from '@/components/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import Notes from '@/views/courses/notes/Notes'
import PageHeader from '@/components/PageHeader'

export default function NotesList() {
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(undefined)

  return (
    <AnimationContainer>
      <PageHeader title='Notes' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Notes' }]} />
      <FiltersDataInput
        courseId={courseId}
        categoryId={categoryId}
        setCourseId={setCourseId}
        setCategoryId={setCategoryId}
        setSubCategoryId={setSubCategoryId}
      />
      <Notes courseId={courseId} categoryId={categoryId} subCategoryId={subCategoryId} />
    </AnimationContainer>
  )
}
