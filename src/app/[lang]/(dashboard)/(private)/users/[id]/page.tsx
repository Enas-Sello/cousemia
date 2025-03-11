import React from 'react'

import { notFound } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// api call
import { getUser } from '@/data/users/getUsers'

//types import
import type { UserType } from '@/types/usertTypes'

// Component Imports
import UserOverview from '@/views/users/UserOverview'
import UserCourses from '@/views/users/UserCourses'

export default async function page({ params }: { params: { id: number } }) {
  const user: UserType = (await getUser(params.id)) as UserType

  console.log('====', { user })

  if (!user) {
    notFound()
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserOverview user={user} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserCourses user={user} />
      </Grid>
    </Grid>
  )
}
