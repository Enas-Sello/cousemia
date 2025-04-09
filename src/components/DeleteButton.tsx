import { IconButton, Tooltip } from '@mui/material'

const DeleteButton = ({
  deleteConfirm,
  id,
  Tooltiptitle
}: {
  deleteConfirm: (id: number) => void
  id: number
  Tooltiptitle: string
}) => {
  return (
    <Tooltip title={Tooltiptitle} arrow>
      <IconButton onClick={() => deleteConfirm(id)}>
        <i className='tabler-trash text-[18px] text-textSecondary hover:text-red-400' />
      </IconButton>
    </Tooltip>
  )
}

export default DeleteButton
