import type { ChangeEvent } from 'react'

import { Autocomplete, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import { statusList, verfiedList } from '@/types/propsTypes'

interface FilterItemType {
  title: string
  value: string
}

interface StatusAndVerifiedFiltersProps {
  setVerified?: (value: string) => void
  setStatus: (value: string) => void
  Verified?: boolean
}

const StatusAndVerifiedFilters = ({ setVerified, setStatus, Verified }: StatusAndVerifiedFiltersProps) => {
  return (
    <Grid container spacing={6}>
      {Verified && setVerified && (
        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            id='verified'
            options={verfiedList}
            onChange={(event: ChangeEvent<{}>, newValue) => setVerified(newValue?.value ?? '')}
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option: FilterItemType, index) => (
                <Chip {...getTagProps({ index })} key={index} label={option.title} />
              ))
            }}
            getOptionLabel={option => option.title || ''}
            renderInput={params => (
              <CustomTextField {...params} key={params.id} placeholder='Select' label='Verified' />
            )}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Autocomplete
          id='status'
          options={statusList}
          onChange={(event: ChangeEvent<{}>, newValue) => setStatus(newValue?.value ?? '')}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option: FilterItemType, index) => (
              <Chip {...getTagProps({ index })} key={index} label={option.title} />
            ))
          }}
          getOptionLabel={option => option.title || ''}
          renderInput={params => <CustomTextField {...params} key={params.id} placeholder='Select' label='Status' />}
        />
      </Grid>
    </Grid>
  )
}

export default StatusAndVerifiedFilters
