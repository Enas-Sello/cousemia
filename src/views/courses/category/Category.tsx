'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import { Card, CardContent, CardHeader, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid2'

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type { ColumnDef, SortingState } from '@tanstack/react-table'

// Third-party Imports

import Swal from 'sweetalert2'

import { toast } from 'react-toastify'

import type { CourseCategoryType } from '@/types/categoryType'
import { deleteLecture } from '@/data/courses/getLectures'

import AddLectureDrawer from './AddLectureDrawer'
import { getCategories } from '@/data/courses/getCategories'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'

export default function CourseCategory({
  courseId,
  categoryId
}: {
  courseId: number | undefined
  categoryId: number | undefined
}) {
  const [data, setData] = useState<CourseCategoryType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: true,
      id: ''
    }
  ])

  const [addLectureOpen, setAddLectureOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')

  const fetchData = async (course: number | undefined) => {
    const filterQuery = {
      q: globalFilter,
      perPage: perPage,
      page: page === 0 ? 1 : page + 1,
      sortBy: sorting[0]?.id || 'id',
      sortDesc: sorting[0]?.desc ? true : 'asc'
    } as { [key: string]: any }

    if (course) {
      filterQuery.course_id = course

      if (categoryId) {
        filterQuery.parent_id = categoryId
      }
    }

    const result = await getCategories(filterQuery)

    const { total, categories } = result

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
        id: 'id',
        header: 'Id'
      }),
      columnHelper.accessor('course_name', {
        header: 'Course Name'
      }),
      columnHelper.accessor('title_en', {
        header: 'Title En'
      }),
      columnHelper.accessor('title_ar', {
        header: 'Title Ar'
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

  useEffect(() => {
    fetchData(courseId)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, [courseId, categoryId, page, sorting, globalFilter, addLectureOpen, perPage])

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Course Categories' className='pbe-4' />
            <CardContent>
              <TableRowsNumberAndAddNew
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddLectureDrawer open={addLectureOpen} handleClose={() => setAddLectureOpen(!addLectureOpen)} />
    </>
  )
}
