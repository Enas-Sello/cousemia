'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import { Button, Card, CardContent, CardHeader, Chip, Grid, IconButton, MenuItem, Pagination } from '@mui/material'

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

import CustomAvatar from '@/@core/components/mui/Avatar'
import CustomTextField from '@/@core/components/mui/TextField'

import type { FlashCardType } from '@/types/flashCardType'
import { deleteLecture } from '@/data/courses/getLectures'
import tableStyles from '@core/styles/table.module.css'

import StatusChange from './StatusChange'
import AddLectureDrawer from './AddLectureDrawer'
import { getFlashCards } from '@/data/courses/getFlashCards'

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

export default function CourseLectures({ id }: { id: number }) {
  const [data, setData] = useState<FlashCardType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [addLectureOpen, setAddLectureOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')

  const getAvatar = (params: Pick<FlashCardType, 'image'>) => {
    const { image } = params

    return image ? <CustomAvatar src={image} size={40} /> : null
  }

  const fetchData = async (course: number) => {
    const filterQuery = {
      q: globalFilter,
      perPage: perPage,
      page: page === 0 ? 1 : page + 1,
      sortBy: sorting[0]?.id || 'id',
      sortDesc: sorting[0]?.desc ? 'desc' : 'asc',
      course: course
    }

    const result = await getFlashCards(filterQuery)

    const { total, flashCards } = result

    setData(flashCards)
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
        toast.success('Flash Card deleted successfully')
        setData(prevData => prevData.filter(lecture => lecture.id !== id))
      } catch (e) {
        console.log(e)
        toast.error('Failed to delete. Please try again.')
      }
    }
  }

  const columnHelper = createColumnHelper<FlashCardType>()

  const columns = useMemo<ColumnDef<FlashCardType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Id'
      }),
      columnHelper.accessor('front_en', {
        cell: info => (
          <div style={{ width: '150px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{info.getValue()}</div>
        ),
        header: () => <div style={{ width: '150px' }}>Front En</div>
      }),
      columnHelper.accessor('back_en', {
        cell: info => (
          <div style={{ width: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{info.getValue()}</div>
        ),
        header: () => <div style={{ width: '200px' }}>Back En</div>
      }),
      columnHelper.accessor('course', {
        header: 'Course'
      }),
      columnHelper.accessor('category', {
        header: 'Category'
      }),
      columnHelper.accessor('sub_category', {
        header: 'Sub Category'
      }),
      columnHelper.accessor('created_by', {
        header: 'Created By'
      }),
      columnHelper.accessor('created_at', {
        header: 'Created At'
      }),
      columnHelper.display({
        header: 'Is Active',
        cell: ({ row }) => (
          <>
            <StatusChange row={row} />
          </>
        )
      }),
      columnHelper.accessor('is_free_content', {
        header: 'Is Free Content',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.is_free_content ? 'Free Content' : 'Paid Content'}
            color='success'
            size='small'
          />
        )
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
            <CardHeader title='Course Flashcards' className='pbe-4' />
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
                      Add Flash Card
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
