'use client'

import React, { useMemo, useState } from 'react'


import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Card, CardContent } from '@mui/material'
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

import type { QuestionProps, QuestionType } from '@/types/questionType'
import { deleteQuestion, getQuestions } from '@/data/question/questionsQuery'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ConfirmDialog from '@/components/ConfirmDialog'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import DeleteButton from '@/components/DeleteButton'
import EditButton from '@/components/EditButton'
import IsActive from '@/components/IsActive'
import IsFreee from '@/components/IsFree'
import ViewButton from '@/components/ViewButton'

// Define the fuzzy filter for global search
const fuzzyFilter: FilterFn<QuestionType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Define the props for the Question component

export default function Question({ courseId, subCategoryId, categoryId }: QuestionProps) {
  const queryClient = useQueryClient()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)

  // Fetch questions using useQuery
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

      return await getQuestions(filterQuery)
    },
    placeholderData: keepPreviousData
  })

  // Extract questions and total from the query result
  const questions = data?.questions ?? []
  const total = data?.total ?? 0

  // Mutation for deleting a question
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: (_, id) => {
      toast.success('Question deleted successfully')

      // Optimistically update the UI
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
      toast.error('Failed to delete question. Please try again.')
      setConfirmDialog(false)
      setSelectedQuestionId(null)
    }
  })

  // Handle delete confirmation
  const deleteConfirm = (id: number) => {
    setSelectedQuestionId(id)
    setConfirmDialog(true)
  }

  // Handle delete action
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

  // Define table columns
  const columnHelper = createColumnHelper<QuestionType>()

  const columns = useMemo<ColumnDef<QuestionType, any>[]>(
    () => [
      columnHelper.accessor('title_en', {
        header: 'Title (English)',
        cell: ({ getValue }) => (
          <div style={{ width: '350px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
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
      columnHelper.accessor('title_ar', {
        header: 'Title (Arabic)',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.display({
        id: 'is_active',
        header: 'Is Active',
        cell: ({ row }) => (
          <>
            <IsActive is_active={row.original.is_active} />
          </>
        )
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

            <EditButton Tooltiptitle='Edit Note' link={`/study/questionsAnswer/edit/${row.original.id}`} />
            <ViewButton Tooltiptitle='view Note' link={`/study/questionsAnswer/${row.original.id}`} />

            <DeleteButton
              Tooltiptitle='delete Answer'
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
    data: questions,
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
            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
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
