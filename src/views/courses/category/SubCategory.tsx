'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import { Button, Card, CardContent, CardHeader, Grid, IconButton, MenuItem, Pagination } from '@mui/material'

import type { TextFieldProps } from '@mui/material/TextField'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'

import classNames from 'classnames'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'

import Swal from 'sweetalert2'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'

import type { CourseCategoryType } from '@/types/categoryType'
import { deleteLecture } from '@/data/courses/getLectures'
import tableStyles from '@core/styles/table.module.css'

import AddLectureDrawer from '@/views/courses/category/AddLectureDrawer'
import { getSubCategories } from '@/data/courses/getSubCategories'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

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
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default function CourseSubCategory({ id }: { id: number }) {
  const [data, setData] = useState<CourseCategoryType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [addLectureOpen, setAddLectureOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchData = async (course: number) => {
    const filterQuery = {
      id: course,
      is_sub: true,
      q: globalFilter,
      perPage: perPage,
      page: page === 0 ? 1 : page + 1,
      sortBy: sorting[0]?.id || 'id',
      sortDesc: sorting[0]?.desc ? true : false
    }

    const result = await getSubCategories(course, filterQuery)

    const { total, categories } = result('Categories: ', result)

    setData(categories)
    setTotal(total)
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await deleteLecture(id)
        toast.success('Category deleted successfully')
        setData(prevData => prevData.filter(lecture => lecture.id !== id))
      } catch (e) {
        e
        toast.error('Failed to delete. Please try again.')
      }
    }
  }

  const columnHelper = createColumnHelper<CourseCategoryType>()

  const columns = useMemo<ColumnDef<CourseCategoryType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Id'
      }),
      columnHelper.accessor('title_en', {
        header: 'Title En'
      }),
      columnHelper.accessor('title_ar', {
        header: 'Title Ar'
      }),
      columnHelper.accessor('parent_category', {
        header: 'Parent Category'
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div>
            <IconButton>
              <Link href='#' className='flex'>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </Link>
            </IconButton>

            <IconButton onClick={() => handleDelete(row.original.id)}>
              <Link href='#' className='flex'>
                <i className='tabler-trash text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.round(total / perPage),
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

  const pageSize = table.getState().pagination.pageSize
  const currentPage = page + 1
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    fetchData(id)
  }, [id, page, sorting, globalFilter, addLectureOpen])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Course Sub Categories' className='pbe-4' />
            <CardContent>
              <div>
                <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
                  <CustomTextField
                    select
                    value={perPage}
                    onChange={e => setPerPage(Number(e.target.value))}
                    className='is-[80px]'
                  >
                    {[10, 20, 25, 50].map(pageSize => (
                      <MenuItem value={pageSize} key={pageSize}>
                        {pageSize}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                  <div>
                    <DebouncedInput
                      value={globalFilter ?? ''}
                      onChange={value => setGlobalFilter(String(value))}
                      placeholder='Search...'
                      className='is-[300px]'
                    />
                    <Button variant='contained' className='ml-3' onClick={() => setAddLectureOpen(!addLectureOpen)}>
                      Add Category
                    </Button>
                  </div>
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
                                  className={classNames({
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
                            <strong>No data available</strong>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {table.getRowModel().rows.map(row => (
                          <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>

                <div className='flex justify-end items-center mt-4'>
                  <Pagination
                    shape='rounded'
                    color='primary'
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, newPage) => setPage(newPage - 1)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <AddLectureDrawer open={addLectureOpen} handleClose={() => setAddLectureOpen(!addLectureOpen)} />
    </>
  )
}
