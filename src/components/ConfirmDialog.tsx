// React Imports
import type { FC } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

interface ConfirmProps {
  open: boolean
  handleClose: () => void
  handleAction: () => void
  actionText?: string | null
  closeText?: string | null
}

const ConfirmDialog: FC<ConfirmProps> = ({ open, handleClose, handleAction, actionText, closeText }) => {
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
          <DialogContentText id='alert-dialog-description'>You won&apos;t be able to revert this!</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} variant='outlined'>
            {closeText ?? <>Close</>}
          </Button>
          <Button onClick={handleAction} variant='contained' color='error'>
            {actionText ?? <>Yes! Delete</>}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmDialog
