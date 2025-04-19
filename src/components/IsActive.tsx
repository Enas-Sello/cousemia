import { Chip } from "@mui/material"

const IsActive = ({is_active}:{is_active:boolean}) => {
  return (
      <Chip
            label={is_active ? 'Active' : 'Inactive'}
            color={is_active ? 'success' : 'error'}
            variant='tonal'
            size='small'
          />
  )
}

export default IsActive
