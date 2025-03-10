// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

import type { UserType } from '@/types/usertTypes'

const TablePaginationComponent = ({
  table,
  total,
  page,
  setPage
}: {
  table: ReturnType<typeof useReactTable<UserType>>
  total: number
  page: number
  setPage: (page: number) => void
}) => {
  const pageSize = table.getState().pagination.pageSize
  const currentPage = page + 1 // Because page is 0-based in your state
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Showing ${total === 0 ? 0 : page * pageSize + 1} to ${Math.min(
          (page + 1) * pageSize,
          total
        )} of ${total} entries`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={totalPages}
        page={currentPage}
        onChange={(_, newPage) => {
          setPage(newPage - 1) // Update the page state
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
