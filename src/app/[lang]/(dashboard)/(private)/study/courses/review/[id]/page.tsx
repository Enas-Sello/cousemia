'use client'

import { useMemo, useState } from 'react'

import Grid from '@mui/material/Grid2'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent } from '@mui/material'

import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import { getCourseReview } from '@/data/courses/coursesQuery'
import type { CourseReviewResponse, ReviewType } from '@/types/reviews'
import PageHeader from '@/components/PageHeader'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

// Custom fuzzy filter for Tanstack Table
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Table setup
const columnHelper = createColumnHelper<ReviewType>()

const Review = ({ params }: { params: { id: number } }) => {
  const id = params.id

  // State for table controls
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')

  const queryKey = ['courseReview', page, perPage, sorting, globalFilter]

  const { data, isLoading, error, refetch } = useQuery<CourseReviewResponse>({
    queryKey,
    queryFn: () => {
      const filterQuery: Record<string, any> = {
        q: globalFilter,
        perPage,
        page: page === 0 ? 1 : page + 1,
        sortBy: sorting[0]?.id || 'id',
        sortDesc: sorting[0]?.desc ? 'true' : 'false'
      }

      return getCourseReview(id, filterQuery)
    },
    placeholderData: keepPreviousData
  })

  // Define table columns
  const columns = useMemo<ColumnDef<ReviewType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('comment', {
        header: 'Comment',
        cell: info => info.getValue() || 'No comment'
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        cell: info => (info.getValue() ? info.getValue().toFixed(1) : 'N/A')
      })
    ],
    []
  )

  // Initialize the table with react-table
  const table = useReactTable({
    data: data?.reviews || [],
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    pageCount: data ? Math.ceil(data.total / perPage) : 0, 
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: page,
        pageSize: perPage
      }
    },
    onSortingChange: setSorting
  })

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorBox refetch={refetch} error={error} />
  }

  return (
    <AnimationContainer>
      <PageHeader
        title={`Courses`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'courses', href: '/study/courses' },
          { label:'review' }
        ]}
        showBackButton={true}

    
      />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Course Reviews' className='pbe-4' />
            <CardContent>
              <TableRowsNumberAndAddNew
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={data?.total || 0} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
    </AnimationContainer>
  )
}

export default Review
