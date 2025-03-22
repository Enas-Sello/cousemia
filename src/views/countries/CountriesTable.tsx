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
import { IconEdit, IconTrash } from '@tabler/icons-react'

import { toast } from 'react-toastify'

import { deleteCountry, getCountries } from '@/data/countries/countriesApi'
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew'
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter'
import { getAvatar } from '@/libs/helpers/getAvatar'

import GenericTable from '@/components/GenericTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import StatusChange from '../users/StatusChange'
import Loading from '@/components/loading'
import AddCountryDrawer from './AddCountryDrawer'
import ConfirmDialog from '@/components/ConfirmDialog'
import { API_COUNTRIES } from '@/configs/api'

interface CountryType {
  id: number
  title_en: string
  title_ar: string
  country_code: string
  flag: string
  is_active: boolean
  status: string
}

const columnHelper = createColumnHelper<CountryType>()

const CountriesTable = ({ status }: { status: string }) => {
  const queryClient = useQueryClient()
  const [addNew, setAddNew] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
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

  // Fetch countries
  const {
    data: countriesData,
    isLoading: countriesLoading,
    error: countriesError
  } = useQuery<{ countries: CountryType[]; total: number }, Error>({
    queryKey: ['countries', filterQuery],
    queryFn: () => getCountries(filterQuery)
  })

  // Mutation for deleting a country
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCountry(id),
    onSuccess: () => {
      toast.success('Country deleted successfully')

      // Invalidate the countries query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      setConfirmDialog(false)
      setSelectedCountryId(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete. Please try again.')
      setConfirmDialog(false)
      setSelectedCountryId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedCountryId(id)
    setConfirmDialog(true)
  }

  // Handle dialog action (delete)
  const handleDialogAction = async () => {
    if (selectedCountryId !== null) {
      deleteMutation.mutate(selectedCountryId)
    }
  }

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false)
    setSelectedCountryId(null)
  }

  const countries = useMemo(() => countriesData?.countries || [], [countriesData])
  const total = useMemo(() => countriesData?.total || 0, [countriesData])

  // Memoize columns
  const columns: ColumnDef<CountryType, any>[] = [
    columnHelper.accessor('flag', {
      id: 'flag',
      header: 'Flag',
      cell: ({ row }) => (
        <div className='flex items-center gap-4' key={row.id}>
          {getAvatar({ image: row?.original.flag })}
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
    columnHelper.accessor('country_code', {
      id: 'country_code',
      header: 'Country Code'
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: 'Status'
    }),
    columnHelper.display({
      id: 'is_active',
      header: 'Is Active',

      cell: ({ row }) => (
        <>
          <StatusChange route={API_COUNTRIES} id={row.original.id} isActive={row.original.is_active} />
        </>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div key={row.id} className='flex'>
          <IconButton>
            <Link href={`/utilitie/countries/edit/${row.original.id}`} className='flex'>
              <IconEdit size={20} stroke={1.5} />
            </Link>
          </IconButton>

          <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
            <Link href='#' className='flex'>
              <IconTrash size={20} stroke={1.5} />
            </Link>
          </IconButton>
        </div>
      )
    })
  ]

  // Initialize table
  const table = useReactTable({
    data: countries,
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

  if (countriesError) return <div>Error loading countries: {countriesError.message}</div>

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
              addText='Add Country'
              addFunction={() => setAddNew(!addNew)}
            />
          </CardContent>
          {countriesLoading && <Loading />}
          {!countriesLoading && !countriesError && (
            <>
              <GenericTable table={table} />
              <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
            </>
          )}
        </Card>
      </Grid>
      <AddCountryDrawer open={addNew} handleClose={() => setAddNew(!addNew)} />
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText={'Cancel'}
      />
    </>
  )
}

export default CountriesTable
