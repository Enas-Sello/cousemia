// React Imports
import type { FC } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { IconExclamationMark } from '@tabler/icons-react'

//types Import
import type { DeleteProps } from '@/types/propsTypes'

const DeleteDialog: FC<DeleteProps> = ({ open, handleClose, handleDelete }) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='md'
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            width: '450px',
            padding: '24px',
            textAlign: 'center'
          }
        }}
      >
        <div className='flex justify-center'>
          <div className='flex justify-center items-center w-20 h-20 border-2 border-[#f8bb86] rounded-full'>
            <IconExclamationMark size={50} className='text-[#f8bb86]' />
          </div>
        </div>
        {/* Title */}
        <DialogTitle id='alert-dialog-title' className='text-3xl font-semibold pb-2'>
          Are you sure?
        </DialogTitle>
        <DialogContent className='pb-2'>
          <DialogContentText id='alert-dialog-description'>You won&apos;t be able to revert this!</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense flex justify-center items-center '>
          <Button onClick={handleDelete} variant='contained'>
            Yes, Delete it!
          </Button>
          <Button onClick={handleClose} variant='outlined'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteDialog
