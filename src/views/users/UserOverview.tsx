'use client'
import React from 'react'

// MUI Imports
import { Card, CardContent, Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Tabler Icons Imports
import {
  IconUser,
  IconCheck,
  IconPhoneOff,
  IconStar,
  IconFlag,
  IconPhone,
  IconCurrencyDollar
} from '@tabler/icons-react'

// Component Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import type { UserType } from '@/types/usertTypes'
import { getInitials } from '@/utils/getInitials'

const getAvatar = (params: Pick<UserType, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={104} />
  } else {
    return <CustomAvatar size={104}>{getInitials(fullName as string)}</CustomAvatar>
  }
}

export default function UserOverview({ user }: { user: UserType }) {
  console.log('user====>', user)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, xl: 6 }}>
                <div className='flex justify-center flex-col gap-10'>
                  <div className='flex gap-4'>
                    {getAvatar({ avatar: user.avatar, fullName: user.fullName })}
                    <div className='flex flex-col'>
                      <Typography color='text.secondary' variant='h5'>
                        {user.fullName}
                      </Typography>
                      <Typography component='span' color='text.secondary'>
                        {user.email}
                      </Typography>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <CustomAvatar variant='rounded' color='primary' skin='light'>
                      <IconCurrencyDollar size={24} className='text-primary' />
                    </CustomAvatar>
                    <div>
                      <Typography variant='h5'>{user.courses_bought.length || 0}</Typography>
                      <Typography>Courses Bought</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <div className='overflow-x-auto'>
                  <table className='w-full border-separate border-spacing-y-2'>
                    <tbody>
                      {/* Username Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconUser size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Username</Typography>
                          </div>
                        </td>
                        <td>
                          <Typography className='font-medium'>{user.username}</Typography>
                        </td>
                      </tr>

                      {/* Status Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconCheck size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Status</Typography>
                          </div>
                        </td>
                        <td>
                          <Chip
                            variant='tonal'
                            className='capitalize'
                            label={user.is_active ? 'Active' : 'Not Active'}
                            color={user.is_active ? 'success' : 'error'}
                            size='medium'
                          />
                        </td>
                      </tr>

                      {/* Phone Verified Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconPhoneOff size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Phone Verified</Typography>
                          </div>
                        </td>
                        <td>
                          <Chip
                            variant='tonal'
                            className='capitalize'
                            label={user.verified === 'verified' ? 'Verified' : 'Not Verified'}
                            color={user.verified === 'verified' ? 'success' : 'error'}
                            size='medium'
                          />
                        </td>
                      </tr>

                      {/* Referral Code Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconStar size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Referral Code</Typography>
                          </div>
                        </td>
                        <td>
                          <Typography>{user.referral_code}</Typography>
                        </td>
                      </tr>

                      {/* Country Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconFlag size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Country</Typography>
                          </div>
                        </td>
                        <td>
                          <Typography>{user.country}</Typography>
                        </td>
                      </tr>

                      {/* Contact Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconPhone size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Contact</Typography>
                          </div>
                        </td>
                        <td>
                          <Typography>{user.phone}</Typography>
                        </td>
                      </tr>

                      {/* Suspend/Activate Row */}
                      <tr>
                        <td>
                          <div className='flex items-center gap-2'>
                            <CustomAvatar size={18} skin='filled'>
                              <IconCheck size={18} className="text-secondary" />
                            </CustomAvatar>
                            <Typography className='font-medium'>Suspend/Activate</Typography>
                          </div>
                        </td>
                        <td>
                          {/* <Button variant='contained' color='error'>
                              Suspend
                            </Button> */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
