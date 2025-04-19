'use client';

import React from 'react';


import Grid from '@mui/material/Grid2';

import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import PageHeader from '@/components/PageHeader';
import SpecialitiesList from '@/views/specialities/Specialities';



export default function Specialities() {
  return (
    <AnimationContainer>
       <PageHeader title='Specialities' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Specialities' }]} />
             <Grid container spacing={6}>
               <SpecialitiesList />
             </Grid>
    </AnimationContainer>
  );
}
