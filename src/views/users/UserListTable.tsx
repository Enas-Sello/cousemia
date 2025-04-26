'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import { CardContent, Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'

import type { UserType } from '@/types/usertTypes'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import GenericTable from '@/components/GenericTable'
import StatusChange from './StatusChange'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import StatusAndVerifiedFilters from '@/components/form-fields/StatusAndVerifiedFilters'
import { API_USERS } from '@/configs/api'

// Define the props for the UserListTable component
interface UserListTableProps {
  users: UserType[]
  total: number
  isLoading: boolean
  error: unknown
  refetch: () => void
  perPage: number
  setPerPage: (perPage: number) => void
  page: number
  setPage: (page: number) => void
  setSortBy: (sortBy: string) => void
  setSortDesc: (sortDesc: string) => void
  setStatus: (status: string) => void
  setVerified: (verified: string) => void
  setSearch: (search: string) => void
}

// Define the fuzzy filter for global search
const fuzzyFilter: FilterFn<UserType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Helper to render user avatar
const getAvatar = (params: Pick<UserType, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={30} />
  } else {
    return <CustomAvatar size={24}>{getInitials(fullName)}</CustomAvatar>
  }
}

const UserListTable = ({
  users,
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
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')

  // Sync sorting state with parent
  useEffect(() => {
    if (sorting[0]) {
      setSortBy(sorting[0].id)
      setSortDesc(sorting[0].desc ? 'true' : 'false')
    }
  }, [sorting, setSortBy, setSortDesc])

  // Sync global filter with parent search
  useEffect(() => {
    setSearch(globalFilter)
  }, [globalFilter, setSearch])

  const columns = useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-normal'>
                {row.original.fullName}
              </Typography>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => getValue() || 'N/A'
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => getValue() || 'N/A'
      },
      {
        accessorKey: 'referral_code',
        header: 'Referral Code',
        cell: ({ getValue }) => getValue() || 'N/A'
      },
      {
        accessorKey: 'is_active',
        header: 'Is Active',
        cell: ({ row }) => <StatusChange route={API_USERS} id={row.original.id} isActive={row.original.is_active} />
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
              color={row.original.verified === 'verified' ? 'success' : 'error'}
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
            <Link href={`/users/${row.original.id}`}>
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: users,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: Math.ceil(total / perPage),
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: page,
        pageSize: perPage
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Filters' className='pbe-4' />
          <CardContent>
            <StatusAndVerifiedFilters setVerified={setVerified} setStatus={setStatus} Verified />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <TableRowsNumberAndAddNew
              addText='Add User'
              perPage={perPage}
              setPerPage={setPerPage}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              addButton
              type='link'
              href='/users/create'
            />
          </CardContent>
          <GenericTable table={table} />
          <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserListTable
