'use client'
import React, { useState } from 'react'

import Lectures from '@/views/apps/lectures/lectures'
import FiltersDataInput from '@/components/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function LectureList() {
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
      <Lectures courseId={courseId} categoryId={categoryId} subCategoryId={subCategoryId}  />
    </AnimationContainer>
  )
}
