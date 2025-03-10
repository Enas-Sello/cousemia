'use client'

// React Imports
import { ChangeEvent, useMemo } from 'react'

// MUI Imports
import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import { Autocomplete, CardContent, Chip, Grid, Typography } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn, Row } from '@tanstack/react-table'

import type { UserType } from '@/types/usertTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'
import StatusChange from './StatusChange'

const getAvatar = (params: Pick<UserType, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={40} />
  } else {
    return <CustomAvatar size={34}>{getInitials(fullName as string)}</CustomAvatar>
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
  setSortBy,
  setSortDesc,
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
        <Link href={`/users/${row.original.id}`}>
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row?.original.avatar, fullName: row.original.fullName })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.fullName}
              </Typography>
            </div>
          </div>
        </Link>
      )
    },
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'referral_code', header: 'Referral Code' },
    {
      accessorKey: 'is_active',
      header: 'Is Active',
      cell: ({ row }) => (
        <>
          <StatusChange row={row} />
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
    filterFns: undefined
  })

  return (
    <Card>
      <CardHeader title='Users' className='pbe-4' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
                <CustomTextField {...params} key={params.id} placeholder='Select status' label='Status' />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <CustomTextField
          select
          value={perPage}
          onChange={e => setPerPage(Number(e.target.value))}
          className='is-[80px]'
        >
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='25'>25</MenuItem>
          <MenuItem value='50'>50</MenuItem>
          <MenuItem value='100'>100</MenuItem>
        </CustomTextField>
        <CustomTextField placeholder='Search...' className='is-[300px]' onChange={e => setSearch(e.target.value)} />
      </div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='tabler-chevron-up text-xl' />,
                          desc: <i className='tabler-chevron-down text-xl' />
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
    </Card>
  )
}

export default UserListTable
