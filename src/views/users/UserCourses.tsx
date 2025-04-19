'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

// Type Imports
import { Button, IconButton } from '@mui/material'

import { toast } from 'react-toastify'

import { IconTrash } from '@tabler/icons-react'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import TablePaginationComponent from './TablePaginationComponent'
import UserCourseAdd from './UserCourseAdd'
import type { CourseType } from '@/types/courseType'
import DeleteDialog from './DeleteDialog'
import type { UserType } from '@/types/usertTypes'
import { deleteUserCourse } from '@/data/courses/coursesQuery'
import GenericTable from '@/components/GenericTable'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {}
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper<CourseType>()

const UserCourses = ({ user }: { user: UserType }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [addCourseModal, setAddCourseModal] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<CourseType[]>(...[user.courses_bought])
  const [globalFilter, setGlobalFilter] = useState('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [userId, setUserId] = useState<number>()
  const [courseId, setCourseId] = useState<number>()

  // const [deleteItem, setDeleteItem] = useState<boolean>(false)

  // Hooks
  const columns = useMemo<ColumnDef<CourseType, any>[]>(
    () => [
      columnHelper.accessor('image', {
        header: 'Image',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar src={row.original.image} size={30} />
          </div>
        )
      }),
      columnHelper.accessor('title_en', {
        header: 'Title En',
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.title_en}</Typography>
      }),
      columnHelper.accessor('bought_on', {
        header: 'Bought On',
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.bought_on}</Typography>
      }),
      columnHelper.accessor('id', {
        header: 'Actions',
        cell: ({ row }) => (
          <>
            <IconButton onClick={() => handleDeleteModal(row.original.id, user.id)}>
              <IconTrash size={18} className='text-secondary' />
            </IconButton>
          </>
        )
      })
    ],
    [user.id]
  )

  const handleDeleteModal = (courseId: number, userId: number) => {
    setOpenModal(true)
    setCourseId(courseId)
    setUserId(userId)
  }

  const handleDelete = () => {
    try {
      deleteUserCourse(courseId, userId)

      // setDeleteItem(true)
      toast.success('Course has been deleted from user.')
      const updatedList = data.filter(item => item.id != courseId)

      setData(updatedList)
    } catch (error) {
      toast.error('Course dose not deleted!')
    }

    handleCloseModal()
  }

  const handleCloseModal = () => {
    setOpenModal(false)

    // setDeleteItem(false)
    setCourseId(0)
    setCourseId(0)
  }

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 7
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <div className='flex items-center justify-between p-6 gap-4'>
        <div className='flex items-center gap-2'>
          <Typography>Show</Typography>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='5'>5</MenuItem>
            <MenuItem value='7'>7</MenuItem>
            <MenuItem value='10'>10</MenuItem>
          </CustomTextField>
        </div>
        <div>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Project'
          />
          <Button variant='contained' className='ml-3' onClick={() => setAddCourseModal(!addCourseModal)}>
            Assign Course To This User
          </Button>
        </div>
      </div>
      <GenericTable table={table} />

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
      <UserCourseAdd
        open={addCourseModal}
        handleClose={() => setAddCourseModal(!addCourseModal)}
        userId={user.id}
        setData={setData}
      />
      <DeleteDialog open={openModal} handleClose={handleCloseModal} handleDelete={handleDelete} />
      {/* <DeleteDialog open={deleteItem} handleClose={handleCloseModal} /> */}
    </Card>
  )
}

export default UserCourses
