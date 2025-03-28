import { Box, Button, Typography } from '@mui/material'

interface ErrorBoxProps {
  refetch: () => void
  error: { message: string }
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error, refetch }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        width: '100%',
        gap: '5px'
      }}
    >
      <Typography variant='h6' color='error'>
        Error: {error.message || 'Failed to load country details'}
      </Typography>
      <Button variant='contained' onClick={() => refetch()} sx={{ mt: 2 }}>
        Retry
      </Button>
    </Box>
  )
}

export default ErrorBox
