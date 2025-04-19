'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import CustomTextField from '@/@core/components/mui/TextField'
import ImageUploader from '@components/ImageUploader'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddNewSpecialities = ({ open, handleClose }: Props) => {
  // States
  const [thumb, setThumb] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('thumb link: ', thumb)
    console.log('submit form')
    handleClose()
  }

  const handleReset = () => {
    handleClose()
  }

  useEffect(() => {}, [])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>New Specialty</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <div className='flex items-center mb-2'>
            <CustomTextField label='Title EN' className='w-full' placeholder='Speciality title en' />
          </div>
          <div className='flex items-center mb-2'>
            <CustomTextField label='Title AR' className='w-full' placeholder='Speciality title ar' />
          </div>
          <div className='flex items-center mb-2'>
            <ImageUploader setThumb={setThumb} />
          </div>
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddNewSpecialities
