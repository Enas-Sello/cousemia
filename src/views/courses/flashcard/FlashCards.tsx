'use client'

import React, { useMemo, useState } from 'react'

import Link from 'next/link'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Card, CardContent, IconButton } from '@mui/material'
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

import type { FlashCardType } from '@/types/flashCardType'
import { deleteFlashCard, getFlashCards } from '@/data/flashCards/flashCardsQuery'
import AddFlashCardDrawer from './AddFlashCardDrawer'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ConfirmDialog from '@/components/ConfirmDialog'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import IsActive from '@/components/IsActive'
import IsFreee from '@/components/IsFree'

// Define the fuzzy filter for global search
const fuzzyFilter: FilterFn<FlashCardType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Define the props for the FlashCards component
interface FlashCardsProps {
  courseId: number | undefined
  subCategoryId: number | undefined
  categoryId: number | undefined
}

export default function FlashCards({ courseId, subCategoryId, categoryId }: FlashCardsProps) {
  const queryClient = useQueryClient()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [addFlashCardOpen, setAddFlashCardOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [selectedFlashCardId, setSelectedFlashCardId] = useState<number | null>(null)

  // Fetch flashcards using useQuery
  const queryKey = [
    'flashCards',
    courseId,
    subCategoryId,
    categoryId,
    page,
    perPage,
    sorting,
    globalFilter,
    addFlashCardOpen
  ]

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
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

      return await getFlashCards(filterQuery) // { flashCards: FlashCardType[], total: number }
    },
    placeholderData: keepPreviousData
  })

  // Extract flashcards and total from the query result
  const flashCards = data?.flashCards ?? []
  const total = data?.total ?? 0

  // Mutation for deleting a flashcard
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFlashCard(id),
    onSuccess: (_, id) => {
      toast.success('Flashcard deleted successfully')

      // Optimistically update the UI
      queryClient.setQueryData(queryKey, (oldData: { flashCards: FlashCardType[]; total: number } | undefined) => {
        if (!oldData) return { flashCards: [], total: 0 }

        return {
          flashCards: oldData.flashCards.filter(flashCard => flashCard.id !== id),
          total: oldData.total - 1
        }
      })

      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey })
      setConfirmDialog(false)
      setSelectedFlashCardId(null)
    },
    onError: () => {
      toast.error('Failed to delete flashcard. Please try again.')
      setConfirmDialog(false)
      setSelectedFlashCardId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedFlashCardId(id)
    setConfirmDialog(true)
  }

  // Handle delete action
  const handleDialogAction = () => {
    if (selectedFlashCardId !== null) {
      deleteMutation.mutate(selectedFlashCardId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedFlashCardId(null)
  }

  // Define table columns
  const columnHelper = createColumnHelper<FlashCardType>()

  const columns = useMemo<ColumnDef<FlashCardType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ getValue }) => getValue()
      }),
      columnHelper.accessor('front_en', {
        header: 'Front (English)',
        cell: ({ getValue }) => (
          <div style={{ width: '150px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{getValue().length > 50 ? `${getValue().substring(0, 50)}...` : getValue()}</p>
          </div>
        )
      }),
      columnHelper.accessor('back_en', {
        header: 'Back (English)',
        cell: ({ getValue }) => (
          <div style={{ width: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{getValue().length > 50 ? `${getValue().substring(0, 50)}...` : getValue()}</p>
          </div>
        )
      }),
      columnHelper.accessor('course', {
        header: 'Course',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.accessor('sub_category', {
        header: 'Sub Category',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.accessor('created_by', {
        header: 'Created By',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
      }),
      columnHelper.display({
        header: 'Is Active',
        cell: ({ row }) => <IsActive is_active={row.original.is_active} />
      }),
      columnHelper.accessor('is_free_content', {
        header: 'Is Free Content',
        cell: ({ row }) => (
          <IsFreee is_free={row.original.is_free_content} />

        )
      }),
      columnHelper.display({
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <IconButton>
              <Link href={`/study/flashCards/edit/${row.original.id}`} className='flex'>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
            <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        )
      })
    ],
    [columnHelper]
  )

  // Initialize the table
  const table = useReactTable({
    data: flashCards,
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

  // Handle loading and error states
  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorBox refetch={refetch} error={error} />
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <TableRowsNumberAndAddNew
                addText='Add Flashcard'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                type='button'
                addFunction={() => setAddFlashCardOpen(true)}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddFlashCardDrawer open={addFlashCardOpen} handleClose={() => setAddFlashCardOpen(false)} />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}
