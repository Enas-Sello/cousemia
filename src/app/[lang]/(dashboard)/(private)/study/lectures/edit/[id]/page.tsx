'use client'
import React from 'react'

import { useQuery } from '@tanstack/react-query'

import LectureUpdateForm from './LectureUpdateForm'
import { getLecture } from '@/data/lectures/lecturesQuery'
import ErrorBox from '@/components/ErrorBox'
import Loading from '@/components/loading'
import PageHeader from '@/components/PageHeader'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function EditCourse({ params }: { params: { id: number } }) {
  // Fetch course data using React Query
  const {
    data: lecture,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['lectures', params.id],
    queryFn: () => getLecture(params.id)
  })

  const lectureData = lecture?.data

  if (isLoading) {
    return <Loading />
  }

  if (!lectureData) {
    return <ErrorBox error={error} refetch={refetch} />
  }

  return (
    <AnimationContainer>
      <PageHeader title='Lectures' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Lectures' }]} />
      <LectureUpdateForm lectureData={lectureData} />
    </AnimationContainer>)
}
