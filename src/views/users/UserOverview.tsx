'use client'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { UserType } from '@/types/usertTypes'
import { getInitials } from '@/utils/getInitials'
import { Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import React from 'react'

const getAvatar = (params: Pick<UserType, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={150} />
  } else {
    return <CustomAvatar size={150}>{getInitials(fullName as string)}</CustomAvatar>
  }
}

export default function UserOverview({ user }: { user: UserType }) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col pbs-12 gap-6'>
            <div className='flex flex-col gap-6'>
              <div className='flex items-center justify-center flex-col gap-4'>
                <div className='flex flex-col items-center gap-4'>
                  {getAvatar({ avatar: user.avatar, fullName: user.fullName })}
                  <Typography variant='h5'>{user.fullName}</Typography>
                </div>
                <Chip label='Author' color='secondary' size='small' variant='tonal' />
              </div>
              {/* <div className='flex items-center justify-around flex-wrap gap-4'>
                <div className='flex items-center gap-4'>
                  <CustomAvatar variant='rounded' color='primary' skin='light'>
                    <i className='tabler-checkbox' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>1.23k</Typography>
                    <Typography>Task Done</Typography>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <CustomAvatar variant='rounded' color='primary' skin='light'>
                    <i className='tabler-briefcase' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>568</Typography>
                    <Typography>Project Done</Typography>
                  </div>
                </div>
              </div> */}
            </div>
            <div>
              <Typography variant='h5'>Details</Typography>
              <Divider className='mlb-4' />
              <div className='flex flex-col gap-2'>
                <div className='flex items-center flex-wrap gap-x-1.5'>
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
                    Status
                  </Typography>
                  <Typography color='text.primary'>{user.is_active}</Typography>
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
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
