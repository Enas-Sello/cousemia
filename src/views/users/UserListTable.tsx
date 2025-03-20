'use client'

// React Imports
import type { ChangeEvent } from 'react'
import { useMemo } from 'react'

import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { Autocomplete, CardContent, Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

import type { UserType } from '@/types/usertTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import GenericTable from '@/components/GenericTable'

// Styles Imports
import StatusChange from './StatusChange'
import TableRowsNumber from '@/components/TableRowsNumber'

const getAvatar = (params: Pick<UserType, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={30} />
  } else {
    return <CustomAvatar size={24}>{getInitials(fullName as string)}</CustomAvatar>
  }
}

interface UserListTableProps {
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

type FilterItemType = {
  title: string
  value: string
}

const UserListTable = ({
  tableData,
  total,
  perPage,
  setPerPage,
  page,
  setPage,

  // setSortBy,
  // setSortDesc,
  setStatus,
  setVerified,
  setSearch
}: UserListTableProps) => {
  const data = useMemo(() => tableData, [tableData])

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: 'fullname',
      header: 'User',
      sortDescFirst: true,
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          {getAvatar({ avatar: row?.original.avatar, fullName: row.original.fullName })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-normal'>
              {row.original.fullName}
            </Typography>
          </div>
        </div>
      )
    },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'referral_code', header: 'Referral Code' },
    {
      accessorKey: 'is_active',
      header: 'Is Active',
      cell: ({ row }) => (
        <>
          <StatusChange userID={row.original.id} isActive={row.original.is_active} />
        </>
      )
    },
    {
      accessorKey: 'verified',
      header: 'Verified',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <Chip
            variant='tonal'
            className='capitalize'
            label={row.original.verified}
            color={row.original.verified == 'verified' ? 'success' : 'error'}
            size='medium'
          />
        </div>
      )
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <IconButton>
          <Link href={`/users/${row.original.id}`} className='flex'>
            <i className='tabler-eye text-[22px] text-textSecondary' />
          </Link>
        </IconButton>
      )
    }
  ]

  const verfiedList: FilterItemType[] = [
    {
      title: 'Phone Verified',
      value: '1'
    },
    {
      title: 'Phone Not Verified',
      value: '0'
    }
  ]

  const statusList: FilterItemType[] = [
    {
      title: 'Active',
      value: '1'
    },
    {
      title: 'Inactive',
      value: '0'
    }
  ]

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

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / perPage),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: perPage
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable manual pagination for server-side handling
    manualFiltering: true,

    filterFns: {
      fuzzy: fuzzyFilter
    }
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Filters' className='pbe-4' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  id='status'
                  options={verfiedList}
                  onChange={(event: ChangeEvent<{}>, newValue) => setVerified(newValue?.value ?? '')}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option: FilterItemType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.title} />
                    ))
                  }}
                  getOptionLabel={option => option.title || ''}
                  renderInput={params => (
                    <CustomTextField {...params} key={params.id} placeholder='Select' label='Verified' />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  id='status'
                  options={statusList}
                  onChange={(event: ChangeEvent<{}>, newValue) => setStatus(newValue?.value ?? '')}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option: FilterItemType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.title} />
                    ))
                  }}
                  getOptionLabel={option => option.title || ''}
                  renderInput={params => (
                    <CustomTextField {...params} key={params.id} placeholder='Select' label='Status' />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <TableRowsNumber perPage={perPage} setPerPage={setPerPage} setGlobalFilter={setSearch} />
          </CardContent>

          <GenericTable table={table} />

          <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserListTable
