'use client'
import React, { useState } from 'react'

import FiltersDataInput from '@/components/FiltersDataInput'
import CourseLectures from '@/views/courses/question/Question'

export default function QuestionsAnswer() {
  const [courseId, setCourseId] = useState<number>()

  return (
    <>
      <FiltersDataInput courseId={courseId} setCourseId={setCourseId} />
      <CourseLectures id={courseId} />
    </>
  )
}
