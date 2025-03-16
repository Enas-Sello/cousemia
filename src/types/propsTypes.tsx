// Define TypeScript type for a device
interface Device {
  id: number
  device_id: string
  allow_push_notifications: boolean
  device_name: string
  is_tablet: boolean
  device_type: string
  created_at: string
}

// Define TypeScript props for the component
export interface UserDevicesProps {
  devices: Device[]
}

export interface DeleteProps {
  open: boolean
  handleClose: () => void
  handleDelete: () => void
}
