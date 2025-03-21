'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Typography
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table'

import classNames from 'classnames'

import { toast } from 'react-toastify'

import type { SpecialityType } from '@/types/specialitiesType'
import { getSpecialties, statusUpdateSpecialties } from '@/data/getSpecialties'
import tableStyles from '@core/styles/table.module.css'

import CustomTextField from '@/@core/components/mui/TextField'
import StatusChanger from '@/components/StatusChanger'

import AddNewSpecialities from './new'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function Specialities() {
  const [data, setData] = useState<SpecialityType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sortDesc, setSortDesc] = useState<string>('true')
  const [sortBy, setSortBy] = useState<string>('id')
  const [verified, setVerified] = useState<string>('')
  const [status, setStatus] = useState<boolean>()
  const [search, setSearch] = useState<string>('')
  const [addOpen, setAddOpen] = useState<boolean>(false)

  const getAvatar = (params: Pick<SpecialityType, 'image'>) => {
    const { image } = params

    if (image) {
      return <CustomAvatar src={image} size={40} />
    }
  }

  const fetchData = async () => {
    const filterQuery = {
      searchKey: search,
      perPage: perPage,
      page: page == 0 ? 1 : page + 1
    }

    const result = await getSpecialties(filterQuery)
    const { total, specialities } = result

    setData(specialities)
    setTotal(total)
  }

  const statusUpdate = async (id: number, status: boolean) => {
    status = status ? false : true
    const updated = await statusUpdateSpecialties(id, status)

    fetchData()
    toast.success(updated.data.message)
  }

  const columnHelper = createColumnHelper<SpecialityType>()

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: 'Id'
    }),
    columnHelper.display({
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          {getAvatar({ image: row?.original.image, title_en: row.original.title_en })}
        </div>
      )
    }),
    columnHelper.accessor('title_en', {
      id: 'title_en',
      header: 'Title EN'
    }),
    columnHelper.accessor('title_ar', {
      id: 'title_ar',
      header: 'Title AR'
    }),
    columnHelper.display({
      id: 'status',
      header: 'Is Active',
      cell: ({ row }) => (
        <StatusChanger
          status={row.original.is_active}
          action={() => statusUpdate(row.original.id, row.original.is_active)}
        />
      )
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div>
          <IconButton>
            <Link href='#' className='flex'>
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </Link>
          </IconButton>

          <IconButton>
            <Link href='#' className='flex'>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
        </div>
      )
    })
  ]

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.round(total / perPage),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: perPage
      }
    },
    manualPagination: true,
    filterFns: undefined
  })

  const pageSize = table.getState().pagination.pageSize
  const currentPage = page + 1 // Because page is 0-based in your state
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    fetchData()
  }, [perPage, page, status, verified, search])

  return (
    <AnimationContainer>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Specialities' className='pbe-4' />
            <CardContent>
              <div className='overflow-x-auto'>
                <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
                  <CustomTextField
                    select
                    value={perPage}
                    onChange={e => setPerPage(Number(e.target.value))}
                    className='is-[80px]'
                  >
                    {[10, 20, 25, 50, 100, 200].map(pageSize => (
                      <MenuItem value={pageSize} key={pageSize}>
                        {pageSize}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                  <div>
                    <CustomTextField
                      placeholder='Search...'
                      className='is-[300px]'
                      onChange={e => setSearch(e.target.value)}
                    />
                    <Button variant='contained' className='ml-3' onClick={() => setAddOpen(!addOpen)}>
                      Add Speciality
                    </Button>
                  </div>
                </div>

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
              <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
                <Typography color='text.disabled'>
                  {`Showing ${total === 0 ? 0 : page * pageSize + 1} to ${Math.min(
                    (page + 1) * pageSize,
                    total
                  )} of ${total} entries`}
                </Typography>
                <Pagination
                  shape='rounded'
                  color='primary'
                  variant='tonal'
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, newPage) => {
                    setPage(newPage - 1) // Update the page state
                  }}
                  showFirstButton
                  showLastButton
                />
              </div>
            </CardContent>
            <AddNewSpecialities open={addOpen} handleClose={() => setAddOpen(!addOpen)} />
          </Card>
        </Grid>
      </Grid>
    </AnimationContainer>
  )
}
