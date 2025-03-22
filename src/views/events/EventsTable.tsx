'use client'
import { useMemo, useState } from 'react'

import Link from 'next/link'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Grid from '@mui/material/Grid2'
import { Card, CardContent, IconButton } from '@mui/material'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { toast } from 'react-toastify'

import type { Event } from '@/data/events/eventsApi'
import { fetchEvents, deleteEvent } from '@/data/events/eventsApi' // Updated imports
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'
import { getAvatar } from '@/libs/helpers/getAvatar'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import StatusChange from '../users/StatusChange'
import Loading from '@/components/loading'
import AddEventDrawer from './AddEventDrawer'
import ConfirmDialog from '@/components/ConfirmDialog'
import { API_EVENTS } from '@/configs/api'

const columnHelper = createColumnHelper<Event>()

const EventsTable = ({ status }: { status: string }) => {
  const queryClient = useQueryClient()
  const [addNew, setAddNew] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null) // Renamed from selectedCountryId
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: true,
      id: 'id'
    }
  ])

  const filterQuery = useMemo(
    () => ({
      searchKey: globalFilter,
      perPage,
      page: page === 0 ? 1 : page + 1,
      sortBy: sorting[0]?.id || 'id',
      sortDesc: sorting[0]?.desc ? true : 'asc',
      ...(status && { is_active: status })
    }),
    [globalFilter, perPage, page, sorting, status]
  )

  // Fetch events
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError
  } = useQuery({
    queryKey: ['events', filterQuery],
    queryFn: () => fetchEvents(filterQuery)
  })

  // Mutation for deleting an event
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      toast.success('Event deleted successfully')

      // Invalidate the events query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setConfirmDialog(false)
      setSelectedEventId(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete. Please try again.')
      setConfirmDialog(false)
      setSelectedEventId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedEventId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
  const handleDialogAction = async () => {
    if (selectedEventId !== null) {
      deleteMutation.mutate(selectedEventId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedEventId(null)
  }

  const events = useMemo(() => eventsData?.events || [], [eventsData])
  const total = useMemo(() => eventsData?.total || 0, [eventsData])

  // Memoize columns
  const columns: ColumnDef<Event, any>[] = [
    columnHelper.accessor('image', {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className='flex items-center gap-4' key={row.id}>
          {getAvatar({ image: row?.original.image })}
        </div>
      )
    }),
    columnHelper.accessor('title_en', {
      id: 'title_en',
      header: 'Title EN'
    }),
    columnHelper.accessor('title_ar', {
      id: 'title_ar',
      header: 'Title AR'
    }),
    columnHelper.accessor('event_url', {
      id: 'event_url',
      header: 'Event URL',
      cell: ({ row }) => (
        <a
          href={row.original.event_url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline'
        >
          Link
        </a>
      )
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status'
    }),
    columnHelper.display({
      id: 'is_active',
      header: 'Is Active',
      cell: ({ row }) => <StatusChange route={API_EVENTS} id={row.original.id} isActive={row.original.is_active} />
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div key={row.id} className='flex'>
          <IconButton>
            <Link href={`/utilitie/events/${row.original.id}`} className='flex'>
              <IconEye size={20} stroke={1.5} />
            </Link>
          </IconButton>

          <IconButton>
            <Link href={`/utilitie/events/edit/${row.original.id}`} className='flex'>
              <IconEdit size={20} stroke={1.5} />
            </Link>
          </IconButton>
          <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
            <Link href='#' className='flex' onClick={e => e.preventDefault()}>
              <IconTrash size={20} stroke={1.5} />
            </Link>
          </IconButton>
        </div>
      )
    })
  ]

  // Initialize table
  const table = useReactTable({
    data: events,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(total / perPage),
    manualPagination: true,
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

  if (eventsError) return <div>Error loading events: {eventsError.message}</div>

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <TableRowsNumberAndAddNew
              perPage={perPage}
              setPerPage={setPerPage}
              setGlobalFilter={setGlobalFilter}
              addButton
              addText='Add Event' // Updated text
              addFunction={() => setAddNew(!addNew)}
            />
          </CardContent>
          {eventsLoading && <Loading />}
          {!eventsLoading && !eventsError && (
            <>
              <GenericTable table={table} />
              <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
            </>
          )}
        </Card>
      </Grid>
      <AddEventDrawer open={addNew} handleClose={() => setAddNew(!addNew)} />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}

export default EventsTable
