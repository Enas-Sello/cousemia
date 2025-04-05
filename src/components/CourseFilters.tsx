import { Autocomplete, Card, CardContent, CardHeader, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import type { AdminType } from '@/types/adminType'
import type { SpecialityType } from '@/types/specialitiesType'
import type { StatusType } from '@/types/courseType'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'
import type { CourseFiltersProps } from '@/types/propsTypes'

export default function CourseFilters({
  admins,
  specialities,
  statusList,
  setAdminId,
  setSpeciality,
  setStatus,
  isLoading,
  isError,
  errorMessage,
  refetch
}: CourseFiltersProps) {
  return (
    <Card>
      <CardHeader title='Filters' className='pbe-4 text-secondary' />
      <CardContent className='border-bs py-6'>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorBox refetch={refetch} error={new Error(errorMessage)} />
        ) : (
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                id='admins'
                options={admins}
                onChange={(event, newValue) => setAdminId(newValue?.id ?? undefined)}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option: AdminType, index) => (
                    <Chip {...getTagProps({ index })} key={index} label={option.name} />
                  ))
                }
                getOptionLabel={option => option.name || ''}
                renderInput={params => <CustomTextField {...params} placeholder='Select Creator' label='Creator' />}
                sx={{
                  '& .MuiAutocomplete-listbox': {
                    listStyle: 'none',
                    margin: 0,
                    padding: '8px 0',
                    maxHeight: '40vh',
                    overflow: 'auto',
                    position: 'relative',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                id='specialities'
                options={specialities}
                onChange={(event, newValue) => setSpeciality(newValue?.id ?? undefined)}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option: SpecialityType, index) => (
                    <Chip {...getTagProps({ index })} key={index} label={option.title_en} />
                  ))
                }
                getOptionLabel={option => option.title_en || ''}
                renderInput={params => (
                  <CustomTextField {...params} placeholder='Select Speciality' label='Speciality' />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                id='status'
                options={statusList}
                onChange={(event, newValue) => setStatus(newValue?.value)}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option: StatusType, index) => (
                    <Chip {...getTagProps({ index })} key={index} label={option.label} />
                  ))
                }
                getOptionLabel={option => option.label || ''}
                renderInput={params => <CustomTextField {...params} placeholder='Select Status' label='Status' />}
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
