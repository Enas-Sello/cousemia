import type { AdminType } from './adminType'
import type { StatusType } from './courseType'
import type { NoteType } from './noteType'
import type { SpecialityType } from './specialitiesType'
import type { UserType } from './usertTypes'

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
type FilterItemType = {
  title: string
  value: string
}

export const verfiedList: FilterItemType[] = [
  {
    title: 'Phone Verified',
    value: '1'
  },
  {
    title: 'Phone Not Verified',
    value: '0'
  }
]

export const statusList: FilterItemType[] = [
  {
    title: 'Active',
    value: '1'
  },
  {
    title: 'Inactive',
    value: '0'
  }
]

export interface UserListTableProps {
  tableData: UserType[]
  total: number
  perPage: number
  setPerPage: React.Dispatch<React.SetStateAction<number>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSortBy: React.Dispatch<React.SetStateAction<string>>
  setSortDesc: React.Dispatch<React.SetStateAction<string>>
  setStatus: React.Dispatch<React.SetStateAction<string>>
  setVerified: React.Dispatch<React.SetStateAction<string>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export interface CourseFiltersProps {
  admins: AdminType[]
  specialities: SpecialityType[]
  statusList: StatusType[]
  setAdminId: (value: number | undefined) => void
  setSpeciality: (value: number | undefined) => void
  setStatus: (value: number | undefined) => void
  isLoading: boolean
  isError: boolean
  errorMessage: string
  refetch: () => void
}
