import React from 'react'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import PageHeader from '@/components/PageHeader'

export default function CourseCreate() {
  return <AnimationContainer> <PageHeader
        title={`Courses`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'courses', href: '/study/courses' },
          { label: 'add new course' }
        ]}
        showBackButton={true}
      />
</AnimationContainer>
}
