'use client'
import React from 'react'

// MUI Imports
import { Card, CardContent, Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import type { UserType } from '@/types/usertTypes'
import { getInitials } from '@/utils/getInitials'

const getAvatar = (params: Pick<UserType, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={95} />
  } else {
    return <CustomAvatar size={95}>{getInitials(fullName as string)}</CustomAvatar>
  }
}

export default function UserOverview({ user }: { user: UserType }) {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex  justify-center flex-col gap-4'>
                  <div className='flex gap-4'>
                    {getAvatar({ avatar: user.avatar, fullName: user.fullName })}
                    <div className='flex flex-col '>
                      <Typography variant='h6'>{user.fullName}</Typography>
                      <Typography variant='h6'>{user.email}</Typography>
                    </div>
                  </div>
                  <div className='flex'>
                    <Chip label='Author' color='secondary' size='small' variant='tonal' />
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center flex-wrap gap-x-28'>
                    <Typography className='font-medium' color='text.primary'>
                      Username:
                    </Typography>
                    <Typography>{user.username}</Typography>
                  </div>
                  <div className='flex items-center flex-wrap gap-x-1.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Billing Email:
                    </Typography>
                    <Typography>{user.email}</Typography>
                  </div>
                  <div className='flex items-center flex-wrap gap-x-1.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Status:
                    </Typography>
                    <Typography color='text.primary'>{user.is_active ? 'Active' : 'Inactive'}</Typography>
                  </div>
                  <div className='flex items-center flex-wrap gap-x-1.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Role:
                    </Typography>
                    <Typography color='text.primary'>{user.role}</Typography>
                  </div>
                  <div className='flex items-center flex-wrap gap-x-1.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Contact:
                    </Typography>
                    <Typography color='text.primary'>{user.phone}</Typography>
                  </div>
                  <div className='flex items-center flex-wrap gap-x-1.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Country:
                    </Typography>
                    <Typography color='text.primary'>{user.country}</Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
