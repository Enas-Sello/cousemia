'use client'

import React, { useMemo, useState } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Card, CardContent, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

import type { NotesProps, NoteType } from '@/types/noteType'
import { getNotes, deleteNote } from '@/data/notes/notesQuery' // Renamed deleteLecture to deleteNote
import ConfirmDialog from '@/components/ConfirmDialog'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import AddNoteDrawer from './AddNoteDrawer'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import DeleteButton from '@/components/DeleteButton'
import ViewButton from '@/components/ViewButton'
import EditButton from '@/components/EditButton'

// Define the fuzzy filter for global search
const fuzzyFilter: FilterFn<NoteType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Define the props for the Notes component

export default function Notes({ courseId, subCategoryId, categoryId }: NotesProps) {
  const queryClient = useQueryClient()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined)

  // Fetch notes using useQuery
  const {
    data: notesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notes', courseId, categoryId, subCategoryId, page, perPage, sorting, globalFilter, addNoteOpen],
    queryFn: async () => {
      const filterQuery: { [key: string]: any } = {
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

      const result = await getNotes(filterQuery)

      return result
    }
  })

  // Extract notes and total from the query result
  const notes = notesData?.notes ?? []
  const total = notesData?.total ?? 0

  // Mutation for deleting a note
  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id), // Renamed deleteLecture to deleteNote
    onSuccess: () => {
      toast.success('Note deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setConfirmDialog(false)
    },
    onError: () => {
      toast.error('Failed to delete note. Please try again.')
    }
  })

  // Handle delete confirmation
  const deleteConfirm = (id: number) => {
    setDeleteId(id)
    setConfirmDialog(true)
  }

  // Handle delete dialog close
  const deleteDialogClose = () => {
    setDeleteId(undefined)
    setConfirmDialog(false)
  }

  // Handle delete action
  const deleteAction = () => {
    if (deleteId) {
      deleteNoteMutation.mutate(deleteId)
    }
  }

  // Define table columns
  const columnHelper = createColumnHelper<NoteType>()

  const columns = useMemo<ColumnDef<NoteType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ getValue }) => getValue()
      }),
      columnHelper.accessor('title_en', {
        header: 'Title (en)',
        cell: ({ getValue }) => getValue()
      }),
      columnHelper.accessor('course', {
        header: 'Course',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),

      // columnHelper.accessor('category', {
      //   header: 'Category',
      //   cell: ({ getValue }) => getValue() || 'N/A'
      // }),
      // columnHelper.accessor('sub_category', {
      //   header: 'Sub Category',
      //   cell: ({ getValue }) => getValue() || 'N/A'
      // }),
      columnHelper.accessor('created_by', {
        header: 'Created By',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),

      // columnHelper.accessor('created_at', {
      //   header: 'Created At',
      //   cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
      // }),

      // columnHelper.accessor('title_ar', {
      //   header: 'Title (Arabic)',
      //   cell: ({ getValue }) => getValue() || 'N/A'
      // }),
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
            label={row.original.is_free_content ? 'Free Content' : 'Paid Content'}
            color='success'
            size='small'
            variant='tonal'
          />
        )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <EditButton Tooltiptitle='Edit Note' link={`/study/notes/edit/${row.original.id}`} />
            <ViewButton Tooltiptitle='view Note' link={`/study/notes/${row.original.id}`} />
            <DeleteButton
              Tooltiptitle='delete Note'
              deleteConfirm={() => deleteConfirm(row.original.id)}
              id={row.original.id}
            />
          </div>
        )
      })
    ],
    [columnHelper]
  )

  // Initialize the table
  const table = useReactTable({
    data: notes,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / perPage),
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: page,
        pageSize: perPage
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting
  })

  if (isLoading) {
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
                addText='Add Note'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                addFunction={() => setAddNoteOpen(true)}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddNoteDrawer open={addNoteOpen} handleClose={() => setAddNoteOpen(false)} />
      <ConfirmDialog
        handleAction={deleteAction}
        handleClose={deleteDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}
