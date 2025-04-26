'use client'
import React, { useState } from 'react'

import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import FlashCards from '@/views/courses/flashcard/FlashCards'
import PageHeader from '@/components/PageHeader'

export default function FlashCardsList() {
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(undefined)

  return (
    <AnimationContainer>
      <PageHeader
        title='Flashcards'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Flashcards' }
        ]}
      />
      <FiltersDataInput
        courseId={courseId}
        categoryId={categoryId}
        setCourseId={setCourseId}
        setCategoryId={setCategoryId}
        setSubCategoryId={setSubCategoryId}
      />
      <FlashCards courseId={courseId} categoryId={categoryId} subCategoryId={subCategoryId} />
    </AnimationContainer>
  )
}
