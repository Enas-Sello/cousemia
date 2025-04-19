'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Pagination,
  Typography,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import tableStyles from '@core/styles/table.module.css';
import CustomTextField from '@/@core/components/mui/TextField';
import CustomAvatar from '@/@core/components/mui/Avatar';
import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import Loading from '@/components/loading';
import { fuzzyFilter } from '@/libs/helpers/fuzzyFilter';
import { getSpecialties, deleteSpecialty } from '@/data/specialties/specialtiesQuery';
import type { SpecialityType, SpecialitiesResponse } from '@/types/specialitiesType';
import AddNewSpecialities from './new';
import ConfirmDialog from '@/components/ConfirmDialog';
import IsActive from '@/components/IsActive';

// Column helper
const columnHelper = createColumnHelper<SpecialityType>();




export default function Specialities() {
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
    manualPagination: true,
    manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(total / perPage),
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

  const pageSize = table.getState().pagination.pageSize;
  const currentPage = page + 1;
  const totalPages = Math.ceil(total / pageSize);

  // Handle loading state
  if (isLoading && !data) {
    return <Loading />;
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error: {(error as Error).message || 'Failed to load specialties'}
        </Typography>
        <Button variant="outlined" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <AnimationContainer>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ backgroundColor: 'grey.900', color: 'white' }}>
            <CardHeader title="Specialities" className="pbe-4" />
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
                  <CustomTextField
                    select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="is-[80px]"
                    sx={{
                      '& .MuiInputBase-root': { backgroundColor: 'grey.800', color: 'white' },
                      '& .MuiInputLabel-root': { color: 'white' },
                    }}
                  >
                    {[10, 20, 25, 50, 100, 200].map((size) => (
                      <MenuItem value={size} key={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                  <div className="flex gap-3">
                    <CustomTextField
                      placeholder="Search..."
                      className="is-[300px]"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{
                        '& .MuiInputBase-root': { backgroundColor: 'grey.800', color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setAddOpen(true)}
                      sx={{ backgroundColor: '#e91e63', '&:hover': { backgroundColor: '#d81b60' } }}
                    >
                      Add Speciality
                    </Button>
                  </div>
                </div>

                <table className={tableStyles.table}>
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {header.isPlaceholder ? null : (
                              <div
                                className={classNames({
                                  'flex items-center': header.column.getIsSorted(),
                                  'cursor-pointer select-none': header.column.getCanSort(),
                                })}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                  asc: <i className="tabler-chevron-up text-xl" />,
                                  desc: <i className="tabler-chevron-down text-xl" />,
                                }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={table.getVisibleFlatColumns().length} className="text-center">
                          <Typography color="text.secondary">No data available</Typography>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2">
                <Typography color="text.disabled">
                  {`Showing ${total === 0 ? 0 : page * pageSize + 1} to ${Math.min(
                    (page + 1) * pageSize,
                    total
                  )} of ${total} entries`}
                </Typography>
                <Pagination
                  shape="rounded"
                  color="primary"
                  variant="tonal"
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, newPage) => setPage(newPage - 1)}
                  showFirstButton
                  showLastButton
                />
              </div>
            </CardContent>
            <AddNewSpecialities open={addOpen} handleClose={() => setAddOpen(false)} />
          </Card>
        </Grid>
      </Grid>
      <ConfirmDialog
        handleAction={handleDialogAction}
        handleClose={handleDialogClose}
        open={confirmDialog}
        closeText="Cancel"
      />
    </AnimationContainer>
  );
}
