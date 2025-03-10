'use client'

import React, { ChangeEvent, useEffect, useState } from 'react'

import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Typography
} from '@mui/material'
import { getSpecialties, statusUpdateSpecialties } from '@/data/getSpecialties'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table'
import tableStyles from '@core/styles/table.module.css'
import classNames from 'classnames'
import Link from 'next/link'
import CustomTextField from '@/@core/components/mui/TextField'
import StatusChanger from '@/components/StatusChanger'
import { toast } from 'react-toastify'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { CourseType } from '@/types/courseType'
import { updateCourse, getCourses } from '@/data/courses/getCourses'
import { strTruncate } from '@/utils/str'
import { AdminType } from '@/types/adminType'
import { SpecialityType } from '@/types/specialitiesType'
import { getAdmin } from '@/data/getAdmin'

type StatusType = {
  label: string
  value: number
}

export default function CourseList() {
  const [data, setData] = useState<CourseType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sortDesc, setSortDesc] = useState<string>('true')
  const [sortBy, setSortBy] = useState<string>('id')
  const [status, setStatus] = useState<number>()
  const [search, setSearch] = useState<string>('')
  const [admins, setAdmins] = useState<AdminType[]>([])
  const [specialities, setSpecialities] = useState<SpecialityType[]>([])
  const [adminId, setAdminId] = useState<number>()
  const [speciality, setSpeciality] = useState<number>()

  const getAvatar = (params: Pick<CourseType, 'image'>) => {
    const { image } = params

    if (image) {
      return <CustomAvatar src={image} size={40} />
    }
  }

  const fetchAdminList = async () => {
    const res = await getAdmin()
    setAdmins(res.data.data)
  }

  const fetchSpecialities = async () => {
    const res = await getSpecialties({})
    setSpecialities(res.specialities)
  }

  const fetchData = async () => {
    const filterQuery = {
      q: search,
      perPage: perPage,
      page: page == 0 ? 1 : page + 1,
      admin_id: adminId ?? '',
      speciality: speciality ?? '',
      status: status ?? ''
    }
    const result = await getCourses(filterQuery)
    const { total, courses } = result
    setData(courses)
    setTotal(total)
  }

  const statusUpdate = async (id: number, status: boolean) => {
    status = status ? false : true
    try {
      const updated = await updateCourse(id, { is_active: status })
      fetchData()
      toast.success(updated.data.message)
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }

  const columnHelper = createColumnHelper<CourseType>()

  const columns = [
    columnHelper.accessor('image', {
      id: 'image',
      header: 'Cover Image',
      cell: ({ row }) => (
        <div className='flex items-center gap-4' key={row.id}>
          {getAvatar({ image: row?.original.image })}
        </div>
      )
    }),
    columnHelper.accessor('title_en', {
      id: 'title_en',
      header: 'Title EN',
      cell: ({ row }) => {
        return (
          <Link href={`/courses/${row.original.id}`} className='text-red-600'>
            {strTruncate(row.original.title_en)}
          </Link>
        )
      }
    }),
    columnHelper.accessor('title_ar', {
      id: 'title_ar',
      header: 'Title AR',
      cell: ({ row }) => {
        return (
          <Link href={`/courses/${row.original.id}`} className='text-red-600'>
            {strTruncate(row.original.title_ar)}
          </Link>
        )
      }
    }),
    columnHelper.accessor('admin_name', {
      id: 'admin_name',
      header: 'Admin Name'
    }),
    columnHelper.accessor('speciality', {
      id: 'speciality',
      header: 'Speciality'
    }),
    columnHelper.accessor('price', {
      id: 'price',
      header: 'Price'
    }),
    columnHelper.display({
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div key={row.id}>
          <IconButton>
            <Link href={`/courses/edit/${row.original.id}`} className='flex'>
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
          <IconButton>
            <Link href='#' className='flex'>
              <i className='tabler-star text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
          <IconButton>
            <Link href={`/courses/${row.original.id}`} className='flex'>
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
          <IconButton>
            <Link href='#' className='flex'>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
        </div>
      )
    }),
    columnHelper.accessor('price_after_discount', {
      id: 'price_after_discount',
      header: 'Price After Discount'
    }),
    columnHelper.accessor('lectures_count', {
      id: 'lectures_count',
      header: 'Lectures Count'
    }),
    columnHelper.accessor('notes_count', {
      id: 'notes_count',
      header: 'Notes Count'
    }),
    columnHelper.accessor('flashcards_count', {
      id: 'flashcards_count',
      header: 'Flashcards Count'
    }),
    columnHelper.accessor('questions_count', {
      id: 'questions_count',
      header: 'Questions Count'
    }),
    columnHelper.accessor('rate', {
      id: 'rate',
      header: 'Rate',
      cell: ({ row }) => (
        <div className='flex items-center' key={row.id}>
          {[1, 2, 3, 4, 5].map((rate, index) => {
            if (row.original.rate < rate) {
              return <i className='tabler-star size-4 mr-2' key={index}></i>
            } else {
              return <i className='tabler-star-filled size-4 mr-2 bg-red-500' key={index}></i>
            }
          })}
          <span>({row.original.rate})</span>
        </div>
      )
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
    fetchAdminList()
    fetchSpecialities()
  }, [])

  useEffect(() => {
    fetchData()
  }, [perPage, page, search, status, speciality, adminId])

  const statusList: StatusType[] = [
    {
      label: 'Active',
      value: 1
    },
    {
      label: 'Inactive',
      value: 0
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Courses' className='pbe-4' />
          <CardContent className='border-bs py-6'>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id='admins'
                  options={admins}
                  onChange={(event: ChangeEvent<{}>, newValue) => setAdminId((newValue?.id as number) ?? '')}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option: AdminType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.name} />
                    ))
                  }}
                  getOptionLabel={option => option.name || ''}
                  renderInput={params => (
                    <CustomTextField {...params} key={params.id} placeholder='Select creator' label='Creator' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id='specialities'
                  options={specialities}
                  onChange={(event: ChangeEvent<{}>, newValue) => setSpeciality((newValue?.id as number) ?? '')}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option: SpecialityType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.title_en} />
                    ))
                  }}
                  getOptionLabel={option => option.title_en || ''}
                  renderInput={params => (
                    <CustomTextField {...params} key={params.id} placeholder='Select speciality' label='Speciality' />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id='status'
                  options={statusList}
                  onChange={(event: ChangeEvent<{}>, newValue) => setStatus(newValue?.value)}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option: StatusType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.label} />
                    ))
                  }}
                  getOptionLabel={option => option.label || ''}
                  renderInput={params => (
                    <CustomTextField {...params} key={params.id} placeholder='Select status' label='Status' />
                  )}
                />
              </Grid>
            </Grid>

            <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 gap-4'>
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
                <Button variant='contained' className='ml-3'>
                  Add Course
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
        </Card>
      </Grid>
    </Grid>
  )
}
