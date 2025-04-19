'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import CustomAvatar from '@/@core/components/mui/Avatar';
import Loading from '@/components/loading';
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter';
import { getSpecialties, deleteSpecialty } from '@/data/specialties/specialtiesQuery';
import type { SpecialityType, SpecialitiesResponse } from '@/types/specialitiesType';
import ConfirmDialog from '@/components/ConfirmDialog';
import IsActive from '@/components/IsActive';
import ErrorBox from '@/components/ErrorBox';
import TableRowsNumberAndAddNew from '@/components/TableRowsNumberAndAddNew';
import GenericTable from '@/components/GenericTable';
import TablePaginationComponent from '@/components/TablePaginationComponent';
import AddNewSpecialities from '@/app/[lang]/(dashboard)/(private)/utilitie/specialities/new';

// Column helper
const columnHelper = createColumnHelper<SpecialityType>();




export default function SpecialitiesList() {
  const queryClient = useQueryClient();

  // State for filters
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);

  // Fetch data using React Query
  const { data, isLoading, error, refetch } = useQuery<SpecialitiesResponse>({
    queryKey: ['specialities', page, perPage, search, sortBy, sortDesc],
    queryFn: () =>
      getSpecialties({
        searchKey: search,
        perPage: perPage,
        page: page + 1,
        sortBy: sortBy,
        sortDesc: sortDesc.toString(),
      }),
    placeholderData: keepPreviousData,
  });

  const specialities = data?.specialities ?? [];
  const total = data?.total ?? 0;

  // Mutation for deleting a specialty
  const deleteSpecialtyMutation = useMutation({
    mutationFn: (specialtyId: number) => deleteSpecialty(specialtyId),
    onSuccess: (_, specialtyId) => {
      toast.success('Specialty deleted successfully');
      queryClient.setQueryData(['specialities', page, perPage, search, sortBy, sortDesc], (oldData: SpecialitiesResponse | undefined) => {
        if (!oldData) return { specialities: [], total: 0 };
        
return {
          specialities: oldData.specialities.filter(specialty => specialty.id !== specialtyId),
          total: oldData.total - 1,
        };
      });
      queryClient.invalidateQueries({ queryKey: ['specialities'] });
      setConfirmDialog(false);
      setSelectedSpecialtyId(null);
    },
    onError: () => {
      toast.error('Failed to delete specialty. Please try again.');
      setConfirmDialog(false);
      setSelectedSpecialtyId(null);
    },
  });

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setSelectedSpecialtyId(id);
    setConfirmDialog(true);
  };

  // Handle dialog action (delete)
  const handleDialogAction = () => {
    if (selectedSpecialtyId !== null) {
      deleteSpecialtyMutation.mutate(selectedSpecialtyId);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setConfirmDialog(false);
    setSelectedSpecialtyId(null);
  };


// Define columns outside the component
const columns = useMemo<ColumnDef<SpecialityType, any>[]>(
  () => [
    columnHelper.display({
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          {row.original.image ? (
            <CustomAvatar src={row.original.image} size={40} />
          ) : (
            <CustomAvatar size={40}>{row.original.title_en.charAt(0).toUpperCase()}</CustomAvatar>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('title_en', {
      id: 'title_en',
      header: 'Title EN',
      enableSorting: true,
    }),
    columnHelper.accessor('title_ar', {
      id: 'title_ar',
      header: 'Title AR',
      enableSorting: true,
    }),
   columnHelper.display({
        header: 'Is Active',
        cell: ({ row }) => (
         <IsActive is_active={row.original.is_active}/>
        )
      }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Tooltip title="Edit Specialty" arrow>
            <IconButton>
              <Link href={`/specialities/edit/${row.original.id}`} className="flex">
                <i className="tabler-edit text-[22px] text-textSecondary" />
              </Link>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Specialty" arrow>
            <IconButton onClick={() => handleDeleteConfirm(row.original.id)}>
              <i className="tabler-trash text-[22px] text-textSecondary" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    }),
  ],
  []
);

  // Table setup
  const table = useReactTable({
    data: specialities,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(total / perPage),
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: perPage,
      },
      sorting: [{ id: sortBy, desc: sortDesc }],
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(table.getState().sorting) : updater;
      const sortState = newSorting[0];

      setSortBy(sortState?.id ?? 'id');
      setSortDesc(sortState?.desc ?? true);
    },
  });


  // Handle loading state
  if (isLoading && !data) {
    return <Loading />
  }

  // Handle error state
  if (error) {
    return <ErrorBox error={error}  refetch={refetch}/>
  }

  return (
    <>
        <Grid size={{ xs: 12 }}>
        <Card>
            <CardContent>
            <TableRowsNumberAndAddNew
              perPage={perPage}
              setPerPage={setPerPage}
              setGlobalFilter={setSearch}
            />

            </CardContent>
              <GenericTable table={table} />
              <TablePaginationComponent table={table} total={total} page={page} setPage={setPage} />
            <AddNewSpecialities open={addOpen} handleClose={() => setAddOpen(false)} />
          </Card>
        </Grid>
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText="Cancel"
      />
    </>
  );
}
