'use client';

import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import PageHeader from '@/components/PageHeader';
import ConfigForm from '@/views/config/configForm';


export default function ConfigPage() {
  
  return (
<AnimationContainer>
        <PageHeader title='Config' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Config' }]} />
  <ConfigForm/>
</AnimationContainer>
  );
}
