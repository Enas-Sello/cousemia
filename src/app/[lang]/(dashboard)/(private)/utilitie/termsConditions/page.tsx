'use client'

import { useQuery } from '@tanstack/react-query'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import ErrorBox from '@/components/ErrorBox'
import Loading from '@/components/loading'
import PageHeader from '@/components/PageHeader'
import RichTextEditor from '@/components/RichTextEditor'
import type { EditorResponse } from '@/types/editor'
import { getTermsContent, updateTermsContent } from '@/data/termsConditions/terms'

const TermsAndConditons = () => {
  // Fetch initial "TermsAndConditons" content
  const { data, isLoading, error, refetch } = useQuery<EditorResponse>({
    queryKey: ['termsAndConditons'],
    queryFn: getTermsContent
  })

  if (isLoading) return <Loading />
  if (error) return <ErrorBox error={error} refetch={refetch} />

  return (
    <AnimationContainer>
      <PageHeader
        title='TermsAndConditons'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'TermsAndConditons' }]}
      />
      {data && <RichTextEditor editorData={data} updateFunction={updateTermsContent} queryKey='TermsAndConditons' />}
    </AnimationContainer>
  )
}

export default TermsAndConditons
