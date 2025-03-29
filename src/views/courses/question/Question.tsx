'use client'

import React, { useMemo, useState } from 'react'

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
import { rankItem } from '@tanstack/match-sorter-utils'
import { toast } from 'react-toastify'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { QuestionType } from '@/types/questionType'

import StatusChange from './StatusChange'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ConfirmDialog from '@/components/ConfirmDialog'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import { deleteQuestion, getQuestions } from '@/data/courses/questionsQuery'

// Custom fuzzy filter for Tanstack Table
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Table setup
const columnHelper = createColumnHelper<QuestionType>()

export default function Question({
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

  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: true,
      id: 'id'
    }
  ])

  const [globalFilter, setGlobalFilter] = useState('')
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)

  // React Query: Fetch questions
  const queryClient = useQueryClient()

  const queryKey = ['questions', courseId, subCategoryId, categoryId, page, perPage, sorting, globalFilter]

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

      const result = await getQuestions(filterQuery)

      return result // { questions: QuestionType[], total: number }
    },
    placeholderData: keepPreviousData
  })

  // React Query: Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: (_, id) => {
      toast.success('Question deleted successfully')

      // Optimistically update the UI by filtering out the deleted question
      queryClient.setQueryData(queryKey, (oldData: { questions: QuestionType[]; total: number } | undefined) => {
        if (!oldData) return { questions: [], total: 0 }

        return {
          questions: oldData.questions.filter(question => question.id !== id),
          total: oldData.total - 1
        }
      })

      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey })
      setConfirmDialog(false)
      setSelectedQuestionId(null)
    },
    onError: () => {
      toast.error('Failed to delete. Please try again.')
      setConfirmDialog(false)
      setSelectedQuestionId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedQuestionId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
  const handleDialogAction = () => {
    if (selectedQuestionId !== null) {
      deleteMutation.mutate(selectedQuestionId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedQuestionId(null)
  }

  const columns = useMemo<ColumnDef<QuestionType, any>[]>(
    () => [
      columnHelper.accessor('title_en', {
        cell: info => (
          <div style={{ width: '350px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue().length > 50 ? `${info.getValue().substring(0, 50)}...` : info.getValue()}</p>
          </div>
        ),
        header: () => <div style={{ width: '350px' }}>Title En</div>
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
      columnHelper.accessor('title_ar', {
        header: 'Title Ar'
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
        header: 'Actions',
        cell: ({ row }) => (
          <div>
            <IconButton>
              <Link href={`/study/questionsAnswer/edit/${row.original.id}`} className='flex'>
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

  const table = useReactTable({
    data: data?.questions || [],
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
            <CardHeader title='Course Questions' className='pbe-4' />
            <CardContent>
              <TableRowsNumberAndAddNew
                addText='Add Question'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                type='link'
                href='/study/questionsAnswer/create'
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={data?.total || 0} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}
