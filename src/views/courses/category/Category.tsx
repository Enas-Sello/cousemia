'use client'

import React, { useMemo, useState } from 'react'

import Link from 'next/link'

import { Card, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material'
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
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { IconPlus, IconBook, IconDeviceLaptop, IconChartBar, IconEdit, IconTrash } from '@tabler/icons-react'

import type { CourseCategoryType } from '@/types/categoryType'
import { deleteCategory, getCategories } from '@/data/categories/categoriesQuerys'

import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import ConfirmDialog from '@/components/ConfirmDialog'
import AddFlashCardDrawer from '../flashcard/AddFlashCardDrawer'

// Table setup
const columnHelper = createColumnHelper<CourseCategoryType>()

export default function CourseCategory({
  courseId,
  categoryId
}: {
  courseId: number | undefined
  categoryId: number | undefined
}) {
  // State for table controls
  const [selectedCategoryIdForFlashCard, setSelectedCategoryIdForFlashCard] = useState<number | null>(null)
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [addFlashCardOpen, setAddFlashCardOpen] = useState(false)

  // React Query: Fetch categories
  const queryClient = useQueryClient()

  const queryKey = ['categories', courseId, categoryId, page, perPage, sorting, globalFilter]

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
        filterQuery.course_id = courseId

        if (categoryId) {
          filterQuery.parent_id = categoryId
        }
      }

      const result = await getCategories(filterQuery)

      return result
    },
    placeholderData: keepPreviousData
  })

  // React Query: Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_, id) => {
      toast.success('Category deleted successfully')

      // Optimistically update the UI by filtering out the deleted category
      queryClient.setQueryData(queryKey, (oldData: { categories: CourseCategoryType[]; total: number } | undefined) => {
        if (!oldData) return { categories: [], total: 0 }

        return {
          categories: oldData.categories.filter(category => category.id !== id),
          total: oldData.total - 1
        }
      })

      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey })
      setConfirmDialog(false) // Close the dialog
      setSelectedCategoryId(null) // Reset the selected category
    },
    onError: () => {
      toast.error('Failed to delete. Please try again.')
      setConfirmDialog(false) // Close the dialog on error
      setSelectedCategoryId(null) // Reset the selected category
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedCategoryId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
  const handleDialogAction = () => {
    if (selectedCategoryId !== null) {
      deleteMutation.mutate(selectedCategoryId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedCategoryId(null)
  }

  // Handle add flash card by categoryID
  const handleAddFlashCard = (id: number) => {
    setSelectedCategoryIdForFlashCard(id)
    setAddFlashCardOpen(true)
  }

  const columns = useMemo<ColumnDef<CourseCategoryType, any>[]>(
    () => [
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
          <div className='flex'>
            {/* add question to category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Question</span>} arrow>
              <IconButton>
                <Link href={`/study/questionsAnswer/create?categoryId=${row.original.id}`} className='flex'>
                  <IconPlus size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* add note to  category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Note</span>} arrow>
              <IconButton>
                <Link href={`/study/categories/edit/${row.original.id}`} className='flex'>
                  <IconBook size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* add lectcher to  category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Lecture</span>} arrow>
              <IconButton>
                <Link href={`/study/categories/edit/${row.original.id}`} className='flex'>
                  <IconDeviceLaptop size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* add flashCard to  category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Flash Card</span>} arrow>
              <IconButton>
                <IconChartBar
                  onClick={() => handleAddFlashCard(row.original.id)}
                  size={18}
                  className='text-textSecondary'
                />
              </IconButton>
            </Tooltip>
            {/* edit category */}

            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Edit</span>} arrow>
              <IconButton>
                <Link href={`/study/categories/edit/${row.original.id}`} className='flex'>
                  <IconEdit size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* delet category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Delete</span>} arrow>
              <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
                <Link href='#' className='flex'>
                  <IconTrash size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
          </div>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: data?.categories || [],
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
            <TablePaginationComponent table={table} total={data?.total || 0} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddFlashCardDrawer
        open={addFlashCardOpen}
        handleClose={() => setAddFlashCardOpen(!addFlashCardOpen)}
        coursCategoryId={selectedCategoryIdForFlashCard}
      />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText={'Cancel'}
      />
    </>
  )
}
