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

import type { Offer } from '@/data/offers/offersQuery'
import { fetchOffers, deleteOffer } from '@/data/offers/offersQuery' // Updated imports
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'
import { getAvatar } from '@/libs/helpers/getAvatar'
import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import Loading from '@/components/loading'
import AddOffersDrawer from './AddOffersDrawer'
import ConfirmDialog from '@/components/ConfirmDialog'
import ErroBox from '@/components/ErrorBox'
import IsActive from '@/components/IsActive'

const columnHelper = createColumnHelper<Offer>()

const OffersTable = ({ status }: { status: string }) => {
  const queryClient = useQueryClient()
  const [addNew, setAddNew] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null) // Renamed from selectedCountryId
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

  // Fetch offers
  const {
    data: offersData,
    isLoading: offersLoading,
    error: offersError,
    refetch
  } = useQuery({
    queryKey: ['offers', filterQuery],
    queryFn: () => fetchOffers(filterQuery)
  })

  // Mutation for deleting an offer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOffer(id),
    onSuccess: () => {
      toast.success('Offer deleted successfully')

      // Invalidate the offers query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setConfirmDialog(false)
      setSelectedOfferId(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete. Please try again.')
      setConfirmDialog(false)
      setSelectedOfferId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedOfferId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
  const handleDialogAction = async () => {
    if (selectedOfferId !== null) {
      deleteMutation.mutate(selectedOfferId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedOfferId(null)
  }

  const offers = useMemo(() => offersData?.offers || [], [offersData])
  const total = useMemo(() => offersData?.total || 0, [offersData])

  // Memoize columns
  const columns: ColumnDef<Offer, any>[] = [
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
    columnHelper.accessor('offer_value', {
      id: 'offer_value',
      header: 'Offer Value'
    }),
    columnHelper.accessor('offer_type', {
      id: 'offer_type',
      header: 'Offer Type'
    }),
    columnHelper.accessor('offer_code', {
      id: 'offer_code',
      header: 'Offer Code'
    }),
    columnHelper.accessor('expiration_date', {
      id: 'expiration_date',
      header: 'Expiration Date'
    }),
    columnHelper.accessor('selected_courses', {
      id: 'selected_courses',
      header: 'Selected Courses',
      cell: ({ row }) => (
        <div>
          {row.original.selected_courses.map(course => (
            <div key={course.value}>{course.title}</div>
          ))}
        </div>
      )
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status'
    }),
    columnHelper.display({
      id: 'is_active',
      header: 'Is Active',

      // cell: ({ row }) => <StatusChange route={API_OFFERS} id={row.original.id} isActive={row.original.is_active} />
      cell:({row})=><IsActive is_active={row.original.is_active} />
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div key={row.id} className='flex'>
          <IconButton>
            <Link href={`/utilitie/offers/${row.original.id}`} className='flex'>
              <IconEye size={20} stroke={1.5} />
            </Link>
          </IconButton>
          <IconButton>
            <Link href={`/utilitie/offers/edit/${row.original.id}`} className='flex'>
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
    data: offers,
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

  if (offersError) return <ErroBox error={offersError} refetch={refetch} />

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
              addText='Add Offer' // Updated text
              addFunction={() => setAddNew(!addNew)}
            />
          </CardContent>
          {offersLoading && <Loading />}
          {!offersLoading && !offersError && (
            <>
              <GenericTable table={table} />
              <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
            </>
          )}
        </Card>
      </Grid>
      <AddOffersDrawer open={addNew} handleClose={() => setAddNew(!addNew)} />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText='Cancel'
      />
    </>
  )
}

export default OffersTable
