'use client'

import type { ChangeEvent } from 'react'
import React, { useEffect, useState } from 'react'
import 'animate.css'

import Link from 'next/link'

import { Autocomplete, Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material'

import Grid from '@mui/material/Grid2'

import type { FilterFn } from '@tanstack/react-table'
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import { toast } from 'react-toastify'

import { rankItem } from '@tanstack/match-sorter-utils'

import { getSpecialties } from '@/data/specialties/specialtiesQuery'

import CustomTextField from '@/@core/components/mui/TextField'
import StatusChanger from '@/components/StatusChanger'

import type { CourseType, StatusType } from '@/types/courseType'
import { updateCourse, getCourses } from '@/data/courses/coursesQuery'
import { strTruncate } from '@/utils/str'
import type { AdminType } from '@/types/adminType'
import type { SpecialityType } from '@/types/specialitiesType'
import { getAdmin } from '@/data/getAdmin'
import GenericTable from '@/components/GenericTable'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { getAvatar } from '@/libs/helpers/getAvatar'

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

export default function CourseList() {
  const [data, setData] = useState<CourseType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [status, setStatus] = useState<number>()
  const [search, setSearch] = useState<string>('')
  const [admins, setAdmins] = useState<AdminType[]>([])
  const [specialities, setSpecialities] = useState<SpecialityType[]>([])
  const [adminId, setAdminId] = useState<number>()
  const [speciality, setSpeciality] = useState<number>()

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
    } as { [key: string]: any }

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
            <Link href={`/study/courses/edit/${row.original.id}`} className='flex'>
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
          <IconButton>
            <Link href='#' className='flex'>
              <i className='tabler-star text-[22px] text-textSecondary' />
            </Link>
          </IconButton>
          <IconButton>
            <Link href={`/study/courses/${row.original.id}`} className='flex'>
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
    filterFns: {
      fuzzy: fuzzyFilter
    }
  })

  useEffect(() => {
    fetchAdminList()
    fetchSpecialities()
  }, [])

  useEffect(() => {
    fetchData()
  }, [perPage, page, search, status, speciality, adminId, perPage])

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
    <AnimationContainer>
      <Grid container spacing={6} sx={{ marginBottom: '2rem' }}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Filters' className='pbe-4 text-secondary' />
            <CardContent className='border-bs py-6'>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    id='admins'
                    options={admins}
                    sx={{
                      '& .MuiAutocomplete-listbox': {
                        listStyle: 'none',
                        margin: 0,
                        padding: '8px 0',
                        maxHeight: '40vh',
                        overflow: 'auto',
                        position: 'relative',
                        scrollbarWidth: 'none', // For Firefox
                        msOverflowStyle: 'none', // For IE/Edge
                        '&::-webkit-scrollbar': {
                          display: 'none' // For Chrome, Safari, Edge
                        }
                      }
                    }}
                    onChange={(event: ChangeEvent<{}>, newValue) => setAdminId((newValue?.id as number) ?? '')}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option: AdminType, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option.name} />
                      ))
                    }}
                    getOptionLabel={option => option.name || ''}
                    renderInput={params => (
                      <CustomTextField {...params} placeholder='Select Creator' key={params.id} label='Creator' />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
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
                      <CustomTextField {...params} placeholder='Select Speciality' key={params.id} label='Speciality' />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
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
                      <CustomTextField {...params} placeholder='Select Status' key={params.id} label='Status' />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='border-bs py-6'>
              <TableRowsNumberAndAddNew
                addText='Add Courses'
                perPage={perPage}
                setPerPage={setPerPage}
                setGlobalFilter={setSearch}
                addButton

                // addFunction={() => setAddLectureOpen(!addLectureOpen)}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
    </AnimationContainer>
  )
}
