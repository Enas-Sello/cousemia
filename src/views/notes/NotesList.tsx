import type { ChangeEvent } from 'react'
import { useMemo } from 'react'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import { Autocomplete, CardContent, Chip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn
} from '@tanstack/react-table'

import { rankItem } from '@tanstack/match-sorter-utils'

import type { NoteType } from '@/types/noteType'
import type { NotsListTableProps } from '@/types/propsTypes'
import CustomTextField from '@/@core/components/mui/TextField'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'

type FilterItemType = {
  title: string
  value: string
}

const NotesList = ({
  tableData,
  total,
  perPage,
  setPerPage,
  page,
  setPage,
  setSearch,
  setCourse,
  course,
  setCategory,
  category,
  setSubCategory
}: NotsListTableProps) => {
  const columns: ColumnDef<NoteType>[] = [
    {
      accessorKey: 'title_en',
      header: 'Title',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-normal'>
          {row.original.title_en || row.original.title_ar || 'Untitled'}
        </Typography>
      )
    },
    {
      accessorKey: 'category',
      header: 'Category'
    },
    {
      accessorKey: 'sub_category',
      header: 'Sub Category'
    },
    {
      accessorKey: 'course',
      header: 'Course'
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          variant='tonal'
          className='capitalize'
          label={row.original.is_active ? 'Active' : 'Inactive'}
          color={row.original.is_active ? 'success' : 'error'}
          size='medium'
        />
      )
    },
    {
      accessorKey: 'is_free_content',
      header: 'Free Content',
      cell: ({ row }) => (
        <Chip
          variant='tonal'
          className='capitalize'
          label={row.original.is_free_content ? 'Yes' : 'No'}
          color={row.original.is_free_content ? 'success' : 'warning'}
          size='medium'
        />
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Created At'
    },
    {
      accessorKey: 'created_by',
      header: 'Created By'
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <IconButton>
          <Link href={row.original.url} target='_blank' className='flex'>
            <i className='tabler-eye text-[22px] text-textSecondary' />
          </Link>
        </IconButton>
      )
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

  // Filter options
  const statusList: FilterItemType[] = [
    { title: 'Active', value: '1' },
    { title: 'Inactive', value: '0' }
  ]

  const freeContentList: FilterItemType[] = [
    { title: 'Free', value: '1' },
    { title: 'Paid', value: '0' }
  ]

  const data = useMemo(() => tableData, [tableData])

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

    // filterFns: undefined
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
              {/* Course */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Autocomplete
                  id='course'
                  options={statusList}
                  onChange={(event: ChangeEvent<{}>, newValue) => setCourse(newValue?.value ?? '')}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option: FilterItemType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.title} />
                    ))
                  }}
                  getOptionLabel={option => option.title || ''}
                  renderInput={params => (
                    <CustomTextField {...params} key={params.id} placeholder='Select' label='course' />
                  )}
                />
              </Grid>
              {/* Category */}
              {course && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Autocomplete
                    id='category'
                    options={freeContentList}
                    onChange={(event: ChangeEvent<{}>, newValue) => setCategory(newValue?.value ?? '')}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option: FilterItemType, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option.title} />
                      ))
                    }}
                    getOptionLabel={option => option.title || ''}
                    renderInput={params => (
                      <CustomTextField {...params} key={params.id} placeholder='Select' label='category' />
                    )}
                  />
                </Grid>
              )}
              {/* Sub Category */}
              {course && category && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Autocomplete
                    id='sub_category'
                    options={freeContentList}
                    onChange={(event: ChangeEvent<{}>, newValue) => setSubCategory(newValue?.value ?? '')}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option: FilterItemType, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option.title} />
                      ))
                    }}
                    getOptionLabel={option => option.title || ''}
                    renderInput={params => (
                      <CustomTextField {...params} key={params.id} placeholder='Select' label='Sub Category' />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex gap-2 items-center'>
                  <p className='text-sm'>show</p>
                  <CustomTextField
                    select
                    value={perPage}
                    onChange={e => setPerPage(Number(e.target.value))}
                    className='is-[90px]'
                  >
                    <MenuItem value='10'>10</MenuItem>
                    <MenuItem value='25'>25</MenuItem>
                    <MenuItem value='50'>50</MenuItem>
                    <MenuItem value='100'>100</MenuItem>
                  </CustomTextField>
                  <p className='text-sm'>entries</p>
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex justify-center sm:justify-end'>
                  <CustomTextField
                    placeholder='Search...'
                    className=' w-full sm:is-[300px]'
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </Grid>
            </Grid>
          </CardContent>

          <GenericTable table={table} />

          <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotesList
