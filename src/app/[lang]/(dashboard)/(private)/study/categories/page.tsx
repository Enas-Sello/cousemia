'use client'
import React, { useState } from 'react'

import FiltersDataInput from '@/components/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import CourseCategory from '@/views/courses/category/Category'

export default function CategoriesList() {
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)

  return (
    <AnimationContainer>
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
