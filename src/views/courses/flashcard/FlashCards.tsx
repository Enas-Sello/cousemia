'use client'

import React, { useMemo, useState } from 'react'

import Link from 'next/link'

import { Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import type { ColumnDef, FilterFn, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import { rankItem } from '@tanstack/match-sorter-utils'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FlashCardType } from '@/types/flashCardType'
import { deleteFlashCard, getFlashCards } from '@/data/flashCards/flashCardsQuery'
import StatusChange from './StatusChange'
import AddFlashCardDrawer from './AddFlashCardDrawer'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ConfirmDialog from '@/components/ConfirmDialog'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'

// Custom fuzzy filter for Tanstack Table
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Table setup
const columnHelper = createColumnHelper<FlashCardType>()

export default function FlashCards({
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
  const [addFlashCardOpen, setAddFlashCardOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [selectedFlashCardId, setSelectedFlashCardId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  // Fetch flash cards using React Query
  const queryKey = ['flashCards', courseId, subCategoryId, categoryId, page, perPage, sorting, globalFilter]

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

      return getFlashCards(filterQuery)
    },
    placeholderData: keepPreviousData
  })

  // Mutation for deleting a flash card
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFlashCard(id),
    onSuccess: (_, id) => {
      toast.success('Flash Card deleted successfully')
      queryClient.setQueryData(queryKey, (oldData: { flashCards: FlashCardType[]; total: number } | undefined) => {
        if (!oldData) return { flashCards: [], total: 0 }

        return {
          flashCards: oldData.flashCards.filter(flashCard => flashCard.id !== id),
          total: oldData.total - 1
        }
      })
      queryClient.invalidateQueries({ queryKey })
      setConfirmDialog(false)
      setSelectedFlashCardId(null)
    },
    onError: () => {
      toast.error('Failed to delete. Please try again.')
      setConfirmDialog(false)
      setSelectedFlashCardId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedFlashCardId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
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
  const columns = useMemo<ColumnDef<FlashCardType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Id'
      }),
      columnHelper.accessor('front_en', {
        cell: info => (
          <div style={{ width: '150px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue().length > 50 ? `${info.getValue().substring(0, 50)}...` : info.getValue()}</p>
          </div>
        ),
        header: () => <div style={{ width: '150px' }}>Front En</div>
      }),
      columnHelper.accessor('back_en', {
        cell: info => (
          <div style={{ width: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue().length > 50 ? `${info.getValue().substring(0, 50)}...` : info.getValue()}</p>
          </div>
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
        cell: ({ row }) => <StatusChange row={row} />
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
              <Link href={`/study/flashCards/edit/${row.original.id}`} className='flex'>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
            <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
              <Link href='#' className='flex' onClick={e => e.preventDefault()}>
                <i className='tabler-trash text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        )
      })
    ],
    []
  )

  // Initialize the table with react-table
  const table = useReactTable({
    data: data?.flashCards || [],
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    pageCount: data ? Math.round(data.total / perPage) : 0,
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
            <CardHeader title='Course Flashcards' className='pbe-4' />
            <CardContent>
              <TableRowsNumberAndAddNew
                addText='Add Flash Card'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                type='button'
                addFunction={() => setAddFlashCardOpen(!addFlashCardOpen)}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={data?.total || 0} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddFlashCardDrawer open={addFlashCardOpen} handleClose={() => setAddFlashCardOpen(!addFlashCardOpen)} />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}
