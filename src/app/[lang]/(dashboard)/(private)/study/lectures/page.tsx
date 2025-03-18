'use client'
import React, { useState } from 'react'

import Lectures from '@/views/courses/lectures/lectures'
import FiltersDataInput from '@/components/FiltersDataInput'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function LectureList() {
  const [courseId, setCourseId] = useState<number>()

  return (
    <AnimationContainer>
      <FiltersDataInput courseId={courseId} setCourseId={setCourseId} />
      <Lectures id={courseId} />
    </AnimationContainer>
  )
}
