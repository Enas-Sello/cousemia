'use client'
import React from 'react'

import { useQuery } from '@tanstack/react-query'

import LectureUpdateForm from './LectureUpdateForm'
import { getLecture } from '@/data/lectures/lecturesQuery'
import ErrorBox from '@/components/ErrorBox'
import Loading from '@/components/loading'

export default function EditCourse({ params }: { params: { id: number } }) {
  // Fetch course data using React Query
  const {
    data: lecture,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['course', params.id],
    queryFn: () => getLecture(params.id)
  })

  const lectureData = lecture?.data

  if (isLoading) {
    return <Loading />
  }

  if (!lectureData) {
    return <ErrorBox error={error} refetch={refetch} />
  }

  return <LectureUpdateForm lectureData={lectureData} />
}
