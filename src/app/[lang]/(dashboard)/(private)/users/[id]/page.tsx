import React from 'react'

import { notFound } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// api call
import { Typography } from '@mui/material'

import { getUser } from '@/data/users/usersQuery'

//types import
import type { UserType } from '@/types/usertTypes'

// Component Imports
import UserOverview from '@/views/users/UserOverview'
import UserCourses from '@/views/users/UserCourses'
import UserDevices from '@/views/users/UserDevices'

export default async function page({ params }: { params: { id: number } }) {
  const user: UserType = (await getUser(params.id)) as UserType

  if (!user) {
    notFound()
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserOverview user={user} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h5' component='h5' className='self-start mb-2' color='secondary.dark'>
          Allowed Devices
        </Typography>
        <UserDevices devices={user.devices} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h5' component='h5' className='self-start mb-2' color='secondary.dark'>
          Bought Courses
        </Typography>
        <UserCourses user={user} />
      </Grid>
    </Grid>
  )
}
