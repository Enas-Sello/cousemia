// 'use client'
import React from 'react'

export default function ShowCourse({ params }: { params: { id: number } }) {
  console.log('params remove', params)

  return (
    <></>

    // <Grid container spacing={6}>
    //   <Grid size={{ xs: 12 }}>
    //     <CourseOverview courseId={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <Lectures id={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <FlashCard id={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <Notes id={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <Question id={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <Category id={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <SubCategory id={params.id} />
    //   </Grid>
    //   <Grid size={{ xs: 12 }}>
    //     <Image id={params.id} />
    //   </Grid>
    // </Grid>
  )
}
