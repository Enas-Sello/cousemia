'use client'

import { useQuery } from '@tanstack/react-query'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import ErrorBox from '@/components/ErrorBox'
import Loading from '@/components/loading'
import PageHeader from '@/components/PageHeader'
import RichTextEditor from '@/components/form-fields/RichTextEditor'
import { getPolicyContent, updatePolicyContent } from '@/data/privacyPolicy/policy'
import type { EditorResponse } from '@/types/editor'

const PrivacyPolicy = () => {
  // Fetch initial "PrivacyPolicy" content
  const { data, isLoading, error, refetch } = useQuery<EditorResponse>({
    queryKey: ['privacyPolicy'],
    queryFn: getPolicyContent
  })

  if (isLoading) return <Loading />
  if (error) return <ErrorBox error={error} refetch={refetch} />

  return (
    <AnimationContainer>
      <PageHeader title='PrivacyPolicy' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'PrivacyPolicy' }]} />
      {data && <RichTextEditor editorData={data} updateFunction={updatePolicyContent} queryKey='privacyPolicy' />}
    </AnimationContainer>
  )
}

export default PrivacyPolicy
