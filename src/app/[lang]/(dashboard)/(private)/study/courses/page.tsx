'use client'

import React, { useMemo, useState } from 'react'

import Link from 'next/link'

import { Card, CardContent, IconButton, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import type {  ColumnDef, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { toast } from 'react-toastify'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import 'animate.css'

import GenericTable from '@/components/GenericTable'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ConfirmDialog from '@/components/ConfirmDialog'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import { getAvatar } from '@/libs/helpers/getAvatar'
import { getCourses, deleteCourse } from '@/data/courses/coursesQuery'
import { getSpecialties } from '@/data/specialties/specialtiesQuery'
import { getAdmin } from '@/data/getAdmin'
import type { CourseType, StatusType } from '@/types/courseType'
import CourseFilters from '@/components/CourseFilters'
import PageHeader from '@/components/PageHeader'
import EditButton from '@/components/EditButton'
import ViewButton from '@/components/ViewButton'
import DeleteButton from '@/components/DeleteButton'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'
import IsActive from '@/components/IsActive'

// import StatusChanger from '@/components/StatusChanger'


// Table setup
const columnHelper = createColumnHelper<CourseType>()

export default function CourseList() {
  // State for table controls
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [status, setStatus] = useState<number | undefined>()
  const [adminId, setAdminId] = useState<number | undefined>()
  const [speciality, setSpeciality] = useState<number | undefined>()
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  // Fetch admins using React Query
  const {
    data: adminsData,
    isLoading: isAdminsLoading,
    isError: isAdminsError,
    error: adminsError,
    refetch: refetchAdmins
  } = useQuery({
    queryKey: ['admins'],
    queryFn: getAdmin
  })

  // Fetch specialities using React Query
  const {
    data: specialitiesData,
    isLoading: isSpecialitiesLoading,
    isError: isSpecialitiesError,
    error: specialitiesError,
    refetch: refetchSpecialities
  } = useQuery({
    queryKey: ['specialities'],
    queryFn: () => getSpecialties({})
  })

  // Fetch courses using React Query
  const queryKey = ['courses', perPage, page, sorting, globalFilter, status, adminId, speciality]

  const {
    data,
    isLoading: isCoursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const filterQuery: Record<string, any> = {
        q: globalFilter,
        perPage,
        page: page === 0 ? 1 : page + 1,
        sortBy: sorting[0]?.id || 'id',
        sortDesc: sorting[0]?.desc ? 'true' : 'false',
        admin_id: adminId ?? '',
        speciality: speciality ?? '',
        status: status ?? ''
      }

      return getCourses(filterQuery)
    },
    placeholderData: keepPreviousData
  })

  // Mutation for deleting a course
  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: number) => deleteCourse(courseId),
    onSuccess: (_, courseId) => {
      toast.success('Course deleted successfully')
      queryClient.setQueryData(queryKey, (oldData: { courses: CourseType[]; total: number } | undefined) => {
        if (!oldData) return { courses: [], total: 0 }

        return {
          courses: oldData.courses.filter(course => course.id !== courseId),
          total: oldData.total - 1
        }
      })
      queryClient.invalidateQueries({ queryKey })
      setConfirmDialog(false)
      setSelectedCourseId(null)
    },
    onError: () => {
      toast.error('Failed to delete course. Please try again.')
      setConfirmDialog(false)
      setSelectedCourseId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedCourseId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
  const handleDialogAction = () => {
    if (selectedCourseId !== null) {
      deleteCourseMutation.mutate(selectedCourseId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedCourseId(null)
  }

  // Extract data
  const courses = data?.courses ?? []
  const total = data?.total ?? 0
  const admins = adminsData?.data?.data ?? []
  const specialities = specialitiesData?.specialities ?? []

  // Define table columns
  const columns = useMemo<ColumnDef<CourseType, any>[]>(
    () => [
      columnHelper.accessor('image', {
        id: 'image',
        header: 'Image',
        cell: ({ row }) => <div className='flex items-center gap-4'>{getAvatar({ image: row.original.image })}</div>
      }),
      columnHelper.accessor('title_en', {
        id: 'title_en',
        header: 'Title EN',
        cell: info => (
          <div style={{ width: '180px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue()?.length > 50 ? `${info.getValue()?.substring(0, 20)}...` : info.getValue()}</p>
          </div>
        )
      }),
      columnHelper.accessor('title_ar', {
        id: 'title_ar',
        header: 'Title AR',
        cell: info => (
          <div style={{ width: '180px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue()?.length > 50 ? `${info.getValue()?.substring(0, 20)}...` : info.getValue()}</p>
          </div>
        )
      }),

      // columnHelper.accessor('admin_name', {
      //   id: 'admin_name',
      //   header: 'Admin Name'
      // }),
      columnHelper.accessor('speciality', {
        id: 'speciality',
        header: 'Speciality'
      }),
      columnHelper.accessor('price', {
        id: 'price',
        header: 'Price'
      }),
      columnHelper.accessor('price_after_discount', {
        id: 'price_after_discount',
        header: 'After Discount'
      }),
      columnHelper.display({
        header: 'Is Active',
        cell: ({ row }) => (
                  <IsActive is_active={row.original.is_active}/>
         
        )
      }),
      columnHelper.display({
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <EditButton Tooltiptitle='Edit Course' link={`/study/courses/edit/${row.original.id}`} />

            <Tooltip title='View Reviews' arrow>
              <IconButton>
                <Link href={`/study/courses/review/${row.original.id}`}>
                  <i className='tabler-star text-[18px] text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
            <ViewButton Tooltiptitle='view Courses' link={`/study/courses/${row.original.id}`} />

            <DeleteButton
              Tooltiptitle='Delete Course'
              deleteConfirm={() => handleDeleteConfirm(row.original.id)}
              id={row.original.id}
            />
          </div>
        )
      })

      // columnHelper.accessor('lectures_count', {
      //   id: 'lectures_count',
      //   header: 'Lectures Count'
      // }),
      // columnHelper.accessor('notes_count', {
      //   id: 'notes_count',
      //   header: 'Notes Count'
      // }),
      // columnHelper.accessor('flashcards_count', {
      //   id: 'flashcards_count',
      //   header: 'Flashcards Count'
      // }),
      // columnHelper.accessor('questions_count', {
      //   id: 'questions_count',
      //   header: 'Questions Count'
      // }),
      // columnHelper.accessor('rate', {
      //   id: 'rate',
      //   header: 'Rate',
      //   cell: ({ row }) => (
      //     <div className='flex items-center'>
      //       {[1, 2, 3, 4, 5].map((rate, index) => (
      //         <i
      //           key={index}
      //           className={`tabler-star${row.original.rate >= rate ? '-filled' : ''} size-4 mr-2 ${
      //             row.original.rate >= rate ? 'bg-red-500' : ''
      //           }`}
      //         />
      //       ))}
      //       <span>({row.original.rate})</span>
      //     </div>
      //   )
      // }),
      // columnHelper.display({
      //   id: 'status',
      //   header: 'Is Active',
      //   cell: ({ row }) => <StatusChanger row={row} type='course' />
      // })
    ],
    []
  )

  // Initialize the table with react-table
  const table = useReactTable({
    data: courses,
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

  // Define status options for the filter
  const statusList: StatusType[] = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
  ]

  // Handle loading and error states for the filter section
  const isFilterLoading = isAdminsLoading || isSpecialitiesLoading
  const isFilterError = isAdminsError || isSpecialitiesError

  const filterErrorMessage = isAdminsError
    ? `Failed to load admins: ${adminsError?.message}`
    : isSpecialitiesError
      ? `Failed to load specialities: ${specialitiesError?.message}`
      : ''

  return (
    <AnimationContainer>
      <PageHeader title='Courses' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]} />{' '}
      <Grid container spacing={6} sx={{ marginBottom: '2rem' }}>
        <Grid size={{ xs: 12 }}>
          <CourseFilters
            admins={admins}
            specialities={specialities}
            statusList={statusList}
            setAdminId={setAdminId}
            setSpeciality={setSpeciality}
            setStatus={setStatus}
            isLoading={isFilterLoading}
            isError={isFilterError}
            errorMessage={filterErrorMessage}
            refetch={() => {
              if (isAdminsError) refetchAdmins()
              if (isSpecialitiesError) refetchSpecialities()
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='border-bs py-6'>
              <TableRowsNumberAndAddNew
                addText='Add Courses'
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addButton
                type='button'
                addFunction={() => {}}
              />
            </CardContent>
            {isCoursesLoading ? (
              <Loading />
            ) : coursesError ? (
              <ErrorBox refetch={refetchCourses} error={coursesError} />
            ) : (
              <>
                <GenericTable table={table} />
                <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </AnimationContainer>
  )
}
