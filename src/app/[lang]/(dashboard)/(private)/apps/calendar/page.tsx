// MUI Imports
import Card from '@mui/material/Card'

import AppFullCalendar from '@/libs/styles/AppFullCalendar'
import CalendarWrapper from '@/views/calendar/CalendarWrapper'

// Component Imports

// Styled Component Imports

const CalendarApp = () => {
  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
