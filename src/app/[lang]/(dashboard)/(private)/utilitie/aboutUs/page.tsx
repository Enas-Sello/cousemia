'use client'

import { useQuery } from '@tanstack/react-query'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import PageHeader from '@/components/PageHeader'

import RichTextEditor from '@/components/RichTextEditor'
import { getAboutUsContent, updateAboutUsContent } from '@/data/about/aboutUsQuery'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import type { EditorResponse } from '@/types/editor'

const AboutUs = () => {
  // Fetch initial "About Us" content
  const { data, isLoading, error, refetch } = useQuery<EditorResponse>({
    queryKey: ['aboutUs'],
    queryFn: getAboutUsContent
  })

  if (isLoading) return <Loading />
  if (error) return <ErrorBox error={error} refetch={refetch} />

  return (
    <AnimationContainer>
      <PageHeader title='About us' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About us' }]} />
      {data && <RichTextEditor editorData={data} updateFunction={updateAboutUsContent} queryKey ='aboutUS'/>}
    </AnimationContainer>
  )
}

export default AboutUs
