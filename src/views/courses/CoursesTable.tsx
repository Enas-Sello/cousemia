'use client'

import React, { useMemo, useState } from 'react'


import { useRouter } from 'next/navigation'

import Link from 'next/link'

import { Card, CardContent, IconButton, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import 'animate.css'

import { getCourses, deleteCourse } from '@/data/courses/coursesQuery'
import { getSpecialties } from '@/data/specialties/specialtiesQuery'
import { getAdmin } from '@/data/getAdmin'
import type { CourseType, StatusType } from '@/types/courseType'

import GenericTable from '@/components/GenericTable'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ConfirmDialog from '@/components/ConfirmDialog'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import CourseFilters from '@/components/CourseFilters'
import EditButton from '@/components/EditButton'
import ViewButton from '@/components/ViewButton'
import DeleteButton from '@/components/DeleteButton'
import IsActive from '@/components/IsActive'

import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'
import { getAvatar } from '@/libs/helpers/getAvatar'

// Table setup
const columnHelper = createColumnHelper<CourseType>()

export default function CourseList() {
    const router=useRouter()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState<number | undefined>()
  const [adminId, setAdminId] = useState<number | undefined>()
  const [speciality, setSpeciality] = useState<number | undefined>()
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  const queryKey = ['courses', perPage, page, sorting, globalFilter, status, adminId, speciality]

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => {
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

  const { data: adminsData,isLoading:isAdminsLoading,isError:isAdminsError,refetch:refetchAdmins,error:adminsError} = useQuery({ queryKey: ['admins'], queryFn: getAdmin })

  const { data: specialitiesData,isLoading:isSpecialitiesLoading,isError:isSpecialitiesError,refetch:refetchSpecialities,error: specialitiesError} = useQuery({
    queryKey: ['specialities'],
    queryFn: () => getSpecialties({})
  })

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: number) => deleteCourse(courseId),
    onSuccess: (_, courseId) => {
      toast.success('Course deleted successfully')
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return { courses: [], total: 0 }

        return {
          courses: oldData.courses.filter((course: CourseType) => course.id !== courseId),
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

  const handleDeleteConfirm = (id: number) => {
    setSelectedCourseId(id)
    setConfirmDialog(true)
  }

  const handleDialogAction = () => {
    if (selectedCourseId !== null) {
      deleteCourseMutation.mutate(selectedCourseId)
    }
  }

  const columns = useMemo<ColumnDef<CourseType, any>[]>(() => [
    columnHelper.display({
      id: 'image',
      header: 'Image',
        cell: ({ row }) => <div className='flex items-center gap-4'>{getAvatar({ image: row.original.image })}</div>
    }),
    columnHelper.accessor('title_en', { header: 'Title EN', cell: info => (
          <div style={{ width: '180px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue()?.length > 50 ? `${info.getValue()?.substring(0, 20)}...` : info.getValue()}</p>
          </div>
        )}),
    columnHelper.accessor('title_ar', { header: 'Title AR',cell: info => (
          <div style={{ width: '180px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            <p>{info.getValue()?.length > 50 ? `${info.getValue()?.substring(0, 20)}...` : info.getValue()}</p>
          </div>
        ) }),
    columnHelper.accessor('admin_name', { header: 'Admin' }),
    columnHelper.accessor('speciality', { header: 'Speciality' }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => <IsActive is_active={row.original.is_active} />
    }),
  
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <EditButton link={`/study/courses/edit/${row.original.id}`} Tooltiptitle='Edit Course' />
           <Tooltip title='View Reviews' arrow>
              <IconButton>
                <Link href={`/study/courses/review/${row.original.id}`}>
                  <i className='tabler-star text-[18px] text-textSecondary' />
                </Link>
              </IconButton>
            </Tooltip>
          <ViewButton link={`/study/courses/${row.original.id}`} Tooltiptitle='View Course' />
          <DeleteButton id={row.original.id} deleteConfirm={() => handleDeleteConfirm(row.original.id)} Tooltiptitle='Delete Course' />
        </div>
      )
    })
  ], [])

  const table = useReactTable({
    data: data?.courses || [],
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    onGlobalFilterChange: setGlobalFilter,
    pageCount: data ? Math.ceil(data.total / perPage) : 0,
    state: {
      globalFilter,
      sorting,
      pagination: { pageIndex: page, pageSize: perPage }
    },
    onSortingChange: setSorting
  })

  if (isLoading && !data) return <Loading />
  if (error) return <ErrorBox error={error} refetch={refetch} />

  // Extract data
  const admins = adminsData?.data?.data ?? []
  const specialities = specialitiesData?.specialities ?? []


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
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
                <div className='flex flex-col gap-4'>
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
              <TableRowsNumberAndAddNew
                perPage={perPage}
                setPerPage={setPerPage}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                addText='Add Course'
                addFunction={() => router.push('/study/courses/add')}
                addButton
                />
                </div>
            </CardContent>
            <GenericTable table={table} />
            <TablePaginationComponent table={table} total={data?.total || 0} page={page} setPage={setPage} />
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmDialog}
        handleClose={() => setConfirmDialog(false)}
        handleAction={handleDialogAction}
        closeText='Cancel'
      />
    </>
  )
}
