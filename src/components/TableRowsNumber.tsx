import { Button, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'

interface TableRowsNumberProps {
  perPage: number
  setPerPage: (value: number) => void
  setGlobalFilter: (value: string) => void
  globalFilter?: string
  addText?: string
  addFunction?: () => void
  addButton?: boolean
}

const TableRowsNumber: React.FC<TableRowsNumberProps> = ({
  perPage,
  setPerPage,
  setGlobalFilter,
  addButton,
  addText,
  addFunction
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <div className='flex gap-2 items-center'>
          <p className='text-sm'>show</p>
          <CustomTextField
            select
            value={perPage}
            onChange={e => setPerPage(Number(e.target.value))}
            className='is-[90px]'
          >
            {[1, 10, 20, 25, 50].map(pageSize => (
              <MenuItem value={pageSize} key={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </CustomTextField>
          <p className='text-sm'>entries</p>
        </div>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <div className='flex justify-end '>
          <CustomTextField
            placeholder='Search...'
            className=' w-full sm:is-[300px]'
            onChange={e => setGlobalFilter(e.target.value)}
          />
          {addButton && (
            <Button variant='contained' className='ml-3' onClick={addFunction}>
              {addText}
            </Button>
          )}
        </div>
      </Grid>
    </Grid>
  )
}

export default TableRowsNumber
