'use client'

import React, { useMemo, useState } from 'react'

import Link from 'next/link'

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Card, CardContent, IconButton, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'

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

// Define the props for the CourseCategory component
interface CourseCategoryProps {
  courseId: number | undefined
  categoryId: number | undefined
}

export default function CourseCategory({ courseId, categoryId }: CourseCategoryProps) {
  const queryClient = useQueryClient()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [addFlashCardOpen, setAddFlashCardOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedCategoryIdForFlashCard, setSelectedCategoryIdForFlashCard] = useState<number | null>(null)

  // Fetch categories using useQuery
  const queryKey = ['categories', courseId, categoryId, page, perPage, sorting, globalFilter, addFlashCardOpen]

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

      return await getCategories(filterQuery) // { categories: CourseCategoryType[], total: number }
    },
    placeholderData: keepPreviousData
  })

  // Extract categories and total from the query result
  const categories = data?.categories ?? []
  const total = data?.total ?? 0

  // Mutation for deleting a category
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_, id) => {
      toast.success('Category deleted successfully')

      // Optimistically update the UI
      queryClient.setQueryData(queryKey, (oldData: { categories: CourseCategoryType[]; total: number } | undefined) => {
        if (!oldData) return { categories: [], total: 0 }

        return {
          categories: oldData.categories.filter(category => category.id !== id),
          total: oldData.total - 1
        }
      })

      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey })
      setConfirmDialog(false)
      setSelectedCategoryId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedCategoryId(id)
    setConfirmDialog(true)
  }

  // Handle delete action
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

  // Handle add flashcard by category ID
  const handleAddFlashCard = (id: number) => {
    setSelectedCategoryIdForFlashCard(id)
    setAddFlashCardOpen(true)
  }

  // Define table columns
  const columnHelper = createColumnHelper<CourseCategoryType>()

  const columns = useMemo<ColumnDef<CourseCategoryType, any>[]>(
    () => [
      columnHelper.accessor('course_name', {
        header: 'Course Name',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.accessor('title_en', {
        header: 'Title (English)',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.accessor('title_ar', {
        header: 'Title (Arabic)',
        cell: ({ getValue }) => getValue() || 'N/A'
      }),
      columnHelper.display({
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-1'>
            {/* Add Question to Category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Question</span>} arrow>
              <IconButton>
                <Link href={`/study/questionsAnswer/create?categoryId=${row.original.id}`}>
                  <IconPlus size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* Add Note to Category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Note</span>} arrow>
              <IconButton>
                <Link href={`/study/notes/create?categoryId=${row.original.id}`}>
                  <IconBook size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* Add Lecture to Category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Lecture</span>} arrow>
              <IconButton>
                <Link href={`/study/lectures/create?categoryId=${row.original.id}`}>
                  <IconDeviceLaptop size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* Add Flashcard to Category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Add Flashcard</span>} arrow>
              <IconButton onClick={() => handleAddFlashCard(row.original.id)}>
                <IconChartBar size={18} className='text-textSecondary' />
              </IconButton>
            </Tooltip>
            {/* Edit Category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Edit</span>} arrow>
              <IconButton>
                <Link href={`/study/categories/edit/${row.original.id}`}>
                  <IconEdit size={18} className='text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            {/* Delete Category */}
            <Tooltip placement='top' title={<span style={{ fontSize: '12px' }}>Delete</span>} arrow>
              <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
                <IconTrash size={18} className='text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        )
      })
    ],
    [columnHelper]
  )

  // Initialize the table
  const table = useReactTable({
    data: categories,
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
                addText='Add Category'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                type='link'
                href={`/study/categories/create${courseId ? `?courseId=${courseId}` : ''}`}
              />
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>
      <AddFlashCardDrawer
        open={addFlashCardOpen}
        handleClose={() => setAddFlashCardOpen(false)}
        coursCategoryId={selectedCategoryIdForFlashCard}
      />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}
