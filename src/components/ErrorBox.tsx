import { Alert, Box, Button } from '@mui/material'

interface ErrorBoxProps {
  refetch?: () => void
  error: { message: string } | null
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error, refetch }) => {
  return (
    <Box display='flex' flexDirection={'column'} justifyContent='center' alignItems='center' minHeight='50vh'>
      <Alert severity='error'>{error?.message ? `Failed to load details. ${error?.message}` : ' not found.'}</Alert>
      {refetch && (
        <Button variant='contained' onClick={() => refetch()} sx={{ mt: 2 }}>
          Retry
        </Button>
      )}
    </Box>
  )
}

export default ErrorBox
