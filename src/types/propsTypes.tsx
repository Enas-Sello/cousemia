import type { NoteType } from './noteType'

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
export interface NotsListTableProps {
  tableData: NoteType[]
  total: number
  perPage: number
  setPerPage: React.Dispatch<React.SetStateAction<number>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSortBy: React.Dispatch<React.SetStateAction<string>>
  setSortDesc: React.Dispatch<React.SetStateAction<string>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  setCourse: React.Dispatch<React.SetStateAction<string>>
  setCategory: React.Dispatch<React.SetStateAction<string>>
  setSubCategory: React.Dispatch<React.SetStateAction<string>>
  course: string
  category: string
}
