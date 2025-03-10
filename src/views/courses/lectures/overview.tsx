'use client'
import React, { useEffect, useState } from 'react'

import { Card, CardContent, Chip, Grid, Typography } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getCourse } from '@/data/courses/getCourses'
import type { CourseType } from '@/types/courseType'

export default function CourseOverview({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<CourseType>()

  const fetchCourse = async () => {
    const res = await getCourse(courseId)
    const { data } = res

    setCourse(data)
  }

  useEffect(() => {
    fetchCourse()
  }, [])

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xl={6} className='flex flex-col'>
            <div className='flex'>
              <CustomAvatar src={course?.image} size={104} className='rounded-lg' />
              <div className={'ml-4'}>
                <Typography variant='h5'>{course?.title_en}</Typography>
                <Chip label={course?.title_ar} size='small' variant='tonal' />
              </div>
            </div>

            <div className='flex gap-4 mt-auto'>
              <CustomAvatar variant='rounded' color='primary' skin='light'>
                <i className='tabler-currency-dollar' />
              </CustomAvatar>
              <div>
                <Typography variant='h6'>{course?.price}</Typography>
                <Typography variant='h6'>Courses Price</Typography>
              </div>
            </div>
          </Grid>

          <Grid item xl={6}>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='feather feather-user mr-3'
                        >
                          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                          <circle cx='12' cy='7' r='4'></circle>
                        </svg>
                        English Title
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography>{course?.title_en}</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='feather feather-user mr-3'
                        >
                          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                          <circle cx='12' cy='7' r='4'></circle>
                        </svg>
                        Arabic Title
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography>{course?.title_ar}</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-check'
                        >
                          <polyline points='20 6 9 17 4 12'></polyline>
                        </svg>
                        Status
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Chip label={course?.status} size='small' color='success' variant='tonal' />
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-star'
                        >
                          <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon>
                        </svg>
                        Rating
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <div className='flex items-center'>
                        {[1, 2, 3, 4, 5].map((rate, index) => {
                          // @ts-ignore
                          if (course?.rate < rate) {
                            return <i className='tabler-star size-4 mr-2' key={index}></i>
                          } else {
                            return <i className='tabler-star-filled size-4 mr-2 bg-red-500' key={index}></i>
                          }
                        })}
                        <span>({course?.rate})</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-flag'
                        >
                          <path d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z'></path>
                          <line x1='4' y1='22' x2='4' y2='15'></line>
                        </svg>
                        Flashcards Count
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography color='text.primary'>{course?.flashcards_count}</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-book'
                        >
                          <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path>
                          <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path>
                        </svg>
                        Lectures
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography color='text.primary'>{course?.lectures_count}</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-book-open'
                        >
                          <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
                          <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
                        </svg>
                        Notes Count
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography color='text.primary'>{course?.notes_count}</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-book-open'
                        >
                          <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
                          <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
                        </svg>
                        Questions Count
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography color='text.primary'>{course?.questions_count}</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td className={'pb-4'}>
                      <Typography className='font-medium' color='text.primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-3 feather  feather-book-open'
                        >
                          <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
                          <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
                        </svg>
                        Speciality
                      </Typography>
                    </td>
                    <td className={'pb-4 pl-6'}>
                      <Typography color='text.primary'>{course?.speciality}</Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
