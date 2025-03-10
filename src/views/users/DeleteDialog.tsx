// React Imports
import { FC, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

interface DeleteProps {
  open: boolean
  handleClose: () => void
  handleDelete: () => void
}

const DeleteDialog: FC<DeleteProps> = ({ open, handleClose, handleDelete }) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>You won't be able to revert this!</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant='contained'>
            Yes! Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteDialog
