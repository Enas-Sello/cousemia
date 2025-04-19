'use client'

import { useMemo, useState } from 'react'

import { Card, CardContent } from '@mui/material'

import Grid from '@mui/material/Grid2'

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table'

import { useQuery } from '@tanstack/react-query'

import GenericTable from '@/components/GenericTable'
import Loading from '@/components/loading'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import type { HostCourseRequest, HostCourseRequestsResponse } from '@/data/hostCourse/hostCourseQuery'
import { getHostCourseRequests } from '@/data/hostCourse/hostCourseQuery'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'

const columnHelper = createColumnHelper<HostCourseRequest>()

const HostCourseTable = () => {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: true,
      id: 'id'
    }
  ])

  const filterQuery = useMemo(
    () => ({
      searchKey: globalFilter,
      perPage,
      page: page === 0 ? 1 : page + 1,
      sortBy: sorting[0]?.id || 'id',
      sortDesc: sorting[0]?.desc ? true : 'asc'
    }),
    [globalFilter, perPage, page, sorting]
  )

  // Fetch hostCourseRequests
  const { data, isLoading, error } = useQuery<HostCourseRequestsResponse, Error>({
    queryKey: ['hostCourseRequests', filterQuery],
    queryFn: () => getHostCourseRequests(filterQuery)
  })

  const hostCourse = useMemo(() => data?.hostCourseRequests || [], [data])
  const total = useMemo(() => data?.total || 0, [data])

  // Memoize columns
  const columns: ColumnDef<HostCourseRequest, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      header: 'Name'
    }),
    columnHelper.accessor('mobile', {
      id: 'mobile',
      header: 'Mobile'
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: 'Email'
    }),
    columnHelper.accessor('country', {
      id: 'country',
      header: 'Country'
    }),
    columnHelper.accessor('speciality', {
      id: 'speciality',
      header: 'Speciality'
    }),
    columnHelper.accessor('about_course', {
      id: 'about_course',
      header: 'About Course',
      cell: ({ row }) => (
        <div className='w-xs text-wrap' title={row.original.about_course}>
        {/* <div className='truncate max-w-xs' title={row.original.about_course}> */}
          {row.original.about_course}
        </div>
      )
    })
  ]

  // Initialize table
  const table = useReactTable({
    data: hostCourse,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(total / perPage),
    manualPagination: true,
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
    <>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <TableRowsNumberAndAddNew
              perPage={perPage}
              setPerPage={setPerPage}
              setGlobalFilter={setGlobalFilter}
            />
          </CardContent>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <>
              <GenericTable table={table} />
              <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
            </>
          )}
        </Card>
      </Grid>
    </>
  )
}

export default HostCourseTable
