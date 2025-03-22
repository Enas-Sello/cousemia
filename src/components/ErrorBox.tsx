import { Box, Button, Typography } from '@mui/material'

interface ErrorBoxProps {
  refetch: () => void,
  error: { message: string }
}

const ErroBox: React.FC<ErrorBoxProps> = ({ error, refetch }) => {

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant='h6' color='error'>
        Error: {error.message || 'Failed to load country details'}
      </Typography>
      <Button variant='contained' onClick={() => refetch()} sx={{ mt: 2 }}>
        Retry
      </Button>
    </Box>
  )
}

export default ErroBox
