import { Chip } from "@mui/material"

const IsFreee = ({ is_free }: { is_free: boolean }) => {
  return (
    <Chip
      label={is_free ? 'Free Content' : 'Paid Content'}
      color={is_free ? 'success' : 'warning'}
      variant='tonal'
      size='small'
    />
  )
}

export default IsFreee
