'use client'
// React Imports
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Autocomplete, Chip } from '@mui/material'
import { CourseType } from '@/types/courseType'
import { getCourses, courseAssignToUser } from '@/data/courses/getCourses'
import { toast } from 'react-toastify'
import { UserType } from '@/types/usertTypes'

type Props = {
  open: boolean
  handleClose: () => void
  userId: number
  setData: Dispatch<SetStateAction<CourseType>>
}

const UserCourseAdd = ({ open, handleClose, userId, setData }: Props) => {
  // States
  const [courses, setCourses] = useState<CourseType[]>([])
  const [coursesList, setCoursesList] = useState<CourseType[]>([])
  const [uId, setUId] = useState<number>(userId)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!courses.length) {
      setError('Course field must be required.')
      return false
    }
    const courseIds = courses.map(item => item.id)
    const response = (await courseAssignToUser(uId, courseIds)).data
    toast.success('Course assign to user successfully!')
    const { data } = response
    setData(data.courses_bought)

    handleClose()
  }

  const handleReset = () => {
    handleClose()
    setCourses([])
  }

  const handleChange = (event: ChangeEvent<{}>, newVal: CourseType[]) => {
    setCourses(newVal)
  }

  const getCoursesData = async () => {
    const { total, courses } = await getCourses({})
    setCoursesList(courses)
  }

  useEffect(() => {
    getCoursesData()
  }, [])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Assign Course To User</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <Autocomplete
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={index} label={option.title_en} />
              ))
            }}
            id='course'
            multiple
            value={courses}
            onChange={handleChange}
            options={coursesList}
            getOptionLabel={(course: CourseType) => course.title_en || ''}
            renderInput={params => (
              <CustomTextField
                {...params}
                key={params.id}
                placeholder='Select Course'
                error={!!error}
                helperText={error}
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default UserCourseAdd
