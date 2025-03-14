'use client'
import React from 'react'

import { Card, CardContent, Chip, List, ListItem, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

//Types imports
import type { UserDevicesProps } from '@/types/propsTypes'

const UserDevices: React.FC<UserDevicesProps> = ({ devices }) => {
  return (
    <Grid container spacing={6}>
      {devices.map(device => (
        <Grid key={device.id} size={{ xs: 12, sm: 6 }}>
          <Card className='border border-primary rounded-lg  '>
            <CardContent className='flex flex-col gap-6'>
              <div className='flex flex-col justify-between'>
                <Typography variant='h6' component='h6' className='self-start ' color='secondary.dark'>
                  {device.device_name}
                </Typography>
                <Typography variant='subtitle2' component='span' className=' text-xs self-start' color='secondary.main'>
                  {device.created_at}
                </Typography>
              </div>
              <List>
                <ListItem className='px-0 py-1 '>Device ID: {device.device_id}</ListItem>
                <ListItem className='p-0'>
                  Allow Notifications :{' '}
                  <Chip
                    label={device.allow_push_notifications ? 'Enabled' : 'Disabled'}
                    size='small'
                    color={`${device.allow_push_notifications ? 'info' : 'primary'}`}
                    variant='tonal'
                  />
                </ListItem>
                <ListItem className='px-0 py-1 '>
                  Is Tablet :
                  <Chip
                    label={device.is_tablet ? 'Yes' : 'No'}
                    size='small'
                    color={`${device.is_tablet ? 'primary' : 'warning'}`}
                    variant='tonal'
                  />
                </ListItem>
                <ListItem className='px-0 py-1 '>Device Type : {device.device_type}</ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default UserDevices
