import { Switch } from '@mui/material'

interface ChangerProps {
  status: boolean
  action: () => void
}

export default function StatusChanger({ status, action }: ChangerProps) {
  return <Switch color='primary' checked={status} onChange={action} />
}
