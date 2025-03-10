import React from 'react'

import { notFound } from 'next/navigation'

import { getUser } from '@/data/users/getUsers'
import type { UserType } from '@/types/usertTypes'
import { Grid } from '@mui/material'
import UserOverview from '@/views/users/UserOverview'
import UserCourses from '@/views/users/UserCourses'

export default async function page({ params }: { params: { id: number } }) {
  const user: UserType = (await getUser(params.id)) as UserType

  if (!user) {
    notFound()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserOverview user={user} />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserCourses user={user} />
      </Grid>
    </Grid>
  )
}
