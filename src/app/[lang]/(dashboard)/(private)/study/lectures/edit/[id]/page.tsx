'use client'
import React from 'react'

import { useQuery } from '@tanstack/react-query'

import LectureUpdateForm from './LectureUpdateForm'
import { getLecture } from '@/data/lectures/lecturesQuery'

export default function EditCourse({ params }: { params: { id: number } }) {
  // Fetch course data using React Query
  const { data: lecture, isLoading } = useQuery({
    queryKey: ['course', params.id],
    queryFn: () => getLecture(params.id)
  })

  const lectureData = lecture?.data

  return <LectureUpdateForm lectureData={lectureData} isLectureLoading={isLoading} />
}
