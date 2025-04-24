'use client'

import React, { useMemo, useState } from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Card, CardContent, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { toast } from 'react-toastify'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getLectures, deleteLecture } from '@/data/lectures/lecturesQuery'
import AddLectureDrawer from './AddLectureDrawer'
import ConfirmDialog from '@/components/ConfirmDialog'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import type { LectureType } from '@/types/lectureType'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import EditButton from '@/components/EditButton'
import ViewButton from '@/components/ViewButton'
import DeleteButton from '@/components/DeleteButton'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'



const columnHelper = createColumnHelper<LectureType>()

export default function Lectures({
  courseId,
  subCategoryId,
  categoryId
}: {
  courseId: number | undefined
  subCategoryId: number | undefined
  categoryId: number | undefined
}) {
  // State for table controls
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [addLectureOpen, setAddLectureOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)

  // Fetch lectures using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['lectures', courseId, categoryId, subCategoryId, page, perPage, sorting, globalFilter],
    queryFn: () => {
      const filterQuery: Record<string, any> = {
        q: globalFilter,
        perPage,
        page: page === 0 ? 1 : page + 1,
        sortBy: sorting[0]?.id || 'id',
        sortDesc: sorting[0]?.desc ? 'true' : 'false'
      }

      if (courseId) {
        filterQuery.course = courseId

        if (categoryId) {
          filterQuery.category = categoryId

          if (subCategoryId) {
            filterQuery.sub_category = subCategoryId
          }
        }
      }

      return getLectures(filterQuery)
    },
    placeholderData: keepPreviousData
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setDeleteId(id)
    setConfirmDialog(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteId(undefined)
    setConfirmDialog(false)
  }

  const handleDeleteAction = async () => {
    if (!deleteId) return

    try {
      await deleteLecture(deleteId)
      toast.success('Lecture deleted successfully')
      refetch()
      setConfirmDialog(false)
    } catch (error) {
      toast.error('Failed to delete lecture. Please try again.')
      console.error('Delete error:', error)
    }
  }

  // Get avatar for the video thumbnail
  const getAvatar = (image?: string) => {
    return image ? <CustomAvatar src={image} size={40} /> : null
  }

  // Define table columns
  const columns = useMemo<ColumnDef<LectureType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        id: 'id',
        header: 'ID'
      }),
      columnHelper.display({
        id: 'image',
        header: 'Video Thumb',
        cell: ({ row }) => <div className='flex items-center gap-4'>{getAvatar(row.original.image)}</div>
      }),
      columnHelper.accessor('title_en', {
        header: 'Title EN'
      }),
      columnHelper.accessor('title_ar', {
        header: 'Title AR'
      }),

      // columnHelper.accessor('course', {
      //   header: 'Course'
      // }),
      // columnHelper.accessor('category', {
      //   header: 'Category'
      // }),
      // columnHelper.accessor('sub_category', {
      //   header: 'Sub Category'
      // }),
      columnHelper.accessor('created_by', {
        header: 'Created By'
      }),
      columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
      }),
      columnHelper.display({
        header: 'Is Active',
        cell: ({ row }) => (
          <Chip
            label={row.original.is_active ? 'Active' : 'Inactive'}
            color={row.original.is_active ? 'success' : 'error'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('is_free_content', {
        header: 'Is Free Content',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.is_free_content ? 'Free Content' : 'Paid Content'}
            color={row.original.is_free_content ? 'success' : 'warning'}
            size='small'
          />
        )
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <EditButton Tooltiptitle='Edit Lecture' link={`/study/lectures/edit/${row.original.id}`} />
            <ViewButton Tooltiptitle='view Lectures' link={`/study/lectures/${row.original.id}`} />
            <DeleteButton
              Tooltiptitle='Delete lectures'
              deleteConfirm={() => handleDeleteConfirm(row.original.id)}
              id={row.original.id}
            />
          </div>
        )
      })
    ],
    []
  )

  // Initialize the table with react-table
  const table = useReactTable({
    data: data?.lectures || [],
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

  // Handle loading and error states
  if (isLoading && !data) {
    return <Loading />
  }

  if (error) {
    return <ErrorBox error={error} refetch={refetch} />
  }


  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <TableRowsNumberAndAddNew
                addText='Add Lecture'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                addFunction={() => setAddLectureOpen(true)}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={data?.total || 0} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddLectureDrawer open={addLectureOpen} handleClose={() => setAddLectureOpen(false)} />
      <ConfirmDialog
        handleAction={handleDeleteAction}
        handleClose={handleDeleteDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}
