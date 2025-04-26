import { FormControlLabel, Switch } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller } from 'react-hook-form'

const SwitchFields: React.FC<{
  control: any
}> = ({ control }) => (
  <>
    {/* Is Free Content */}
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name='is_free_content'
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
            label='Is Free Content'
          />
        )}
      />
    </Grid>

    {/* Is Active */}
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name='is_active'
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} />}
            label='Is Active'
          />
        )}
      />
    </Grid>
  </>
)

export default SwitchFields
