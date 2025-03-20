'use client'
import React, { useState } from 'react'

import FiltersDataInput from '@/components/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import Question from '@/views/courses/question/Question'

export default function QuestionsAnswer() {
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(undefined)

  return (
    <AnimationContainer>
      <FiltersDataInput
        courseId={courseId}
        categoryId={categoryId}
        setCourseId={setCourseId}
        setCategoryId={setCategoryId}
        setSubCategoryId={setSubCategoryId}
      />
      <Question courseId={courseId} categoryId={categoryId} subCategoryId={subCategoryId} />
    </AnimationContainer>
  )
}
