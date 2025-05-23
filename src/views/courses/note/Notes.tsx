'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import { Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid2'

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'

import { toast } from 'react-toastify'

import type { LectureType } from '@/types/lectureType'
import { deleteLecture } from '@/data/lectures/lecturesQuery'

import StatusChange from './StatusChange'
import AddLectureDrawer from './AddLectureDrawer'
import ConfirmDialog from '@/components/ConfirmDialog'
import { getNotes } from '@/data/notes/notesQuery'
import type { NoteType } from '@/types/noteType'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

export default function Notes({
  courseId,
  subCategoryId,
  categoryId
}: {
  courseId: number | undefined
  subCategoryId: number | undefined
  categoryId: number | undefined
}) {
  const [data, setData] = useState<LectureType[]>([])
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
      filterQuery.course = course

      if (categoryId) {
        filterQuery.category = categoryId

        if (subCategoryId) {
          filterQuery.sub_category = subCategoryId
        }
      }
    }

    const result = await getNotes(filterQuery)

    const { total, notes } = result

    setData(notes)
    setTotal(total)
  }

  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)

  const deleteAction = async () => {
    try {
      if (deleteId) {
        await deleteLecture(deleteId)
        toast.success('Lecture deleted successfully')
        setData(prevData => prevData.filter(lecture => lecture.id !== deleteId))
        setConfirmDialog(false)
      }
    } catch (e) {
      e
      toast.error('Failed to delete. Please try again.')
    }
  }

  const deleteConfirm = async (id: number) => {
    setConfirmDialog(true)
    setDeleteId(id)
  }

  const deleteDialogClose = () => {
    setDeleteId(undefined)
    setConfirmDialog(!confirmDialog)
  }

  const columnHelper = createColumnHelper<NoteType>()

  const columns = useMemo<ColumnDef<NoteType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Id'
      }),
      columnHelper.accessor('title_en', {
        header: 'Title En'
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
      columnHelper.accessor('title_ar', {
        header: 'Title Ar'
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

            <IconButton onClick={() => deleteConfirm(row.original.id)}>
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
  }, [courseId, categoryId, subCategoryId, page, sorting, globalFilter, addLectureOpen])

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Course Notes' className='pbe-4' />
            <CardContent>
              <TableRowsNumberAndAddNew
                addText='Add Note'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                addFunction={() => setAddLectureOpen(!addLectureOpen)}
              />
            </CardContent>
            <GenericTable table={table} />

            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddLectureDrawer open={addLectureOpen} handleClose={() => setAddLectureOpen(!addLectureOpen)} />
      <ConfirmDialog
        handleAction={deleteAction}
        handleClose={deleteDialogClose}
        open={confirmDialog}
        closeText={'Cancel'}
      />
    </>
  )
}
