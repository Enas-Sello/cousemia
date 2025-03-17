'use client'
import React, { useState } from 'react'

import Lectures from '@/views/courses/lectures/lectures'
import FiltersDataInput from '@/components/FiltersDataInput'

export default function LectureList() {
  const [courseId, setCourseId] = useState<number>()

  return (
    <>
      <FiltersDataInput courseId={courseId} setCourseId={setCourseId} />
      <Lectures id={courseId} />
    </>
  )
}
