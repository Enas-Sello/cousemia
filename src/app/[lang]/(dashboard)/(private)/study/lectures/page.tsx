'use client'

import type { ChangeEvent } from 'react'
import React, { useEffect, useState } from 'react'

import { Autocomplete, Card, CardContent, CardHeader, Chip, Grid } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

import type { CourseType } from '@/types/courseType'
import Lectures from '@/views/courses/lectures/lectures'
import { getCourses } from '@/data/courses/getCourses'
import { getCategoriesByCourseID, getSubCategoryList } from '@/data/categories/getCategories'
import type { CategoryType } from '@/types/categoryType'

export default function LectureList() {
  const [courses, setCourses] = useState<CourseType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [subCategories, setSubCategories] = useState<CategoryType[]>([])
  const [courseId, setCourseId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number>()
  const [subCategoryId, setSubCategoryId] = useState<number>()

  const fetchCourseList = async () => {
    const { courses } = await getCourses({})

    setCourses(courses)
  }

  const fetchCategoryList = async (course_id: number) => {
    const result = await getCategoriesByCourseID(course_id)
    const { data } = result

    setCategories(data)
  }

  const fetchSubCategoryList = async (course_id: number, category_id: number) => {
    const result = await getSubCategoryList(course_id, category_id)
    const { data } = result

    setSubCategories(data)
  }

  useEffect(() => {
    if (courseId && categoryId) {
      fetchSubCategoryList(courseId, categoryId)
    }
  }, [courseId, categoryId])

  useEffect(() => {
    if (courseId) {
      fetchCategoryList(courseId)
    }
  }, [courseId])

  useEffect(() => {
    fetchCourseList()
  }, [])

  return (
    <>
      <Grid container spacing={6} className='mb-6'>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' className='pbe-4' />
            <CardContent className='border-bs py-6'>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    id='courses'
                    options={courses}
                    onChange={(event: ChangeEvent<{}>, newValue) => setCourseId((newValue?.id as number) ?? '')}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option: CourseType, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option.title_en} />
                      ))
                    }}
                    getOptionLabel={option => option.title_en || ''}
                    renderInput={params => (
                      <CustomTextField {...params} key={params.id} placeholder='Select course' label='Course' />
                    )}
                  />
                </Grid>

                {courseId && (
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      id='categories'
                      options={categories}
                      onChange={(event: ChangeEvent<{}>, newValue) => setCategoryId((newValue?.value as number) ?? '')}
                      renderTags={(tagValue, getTagProps) => {
                        return tagValue.map((option: CategoryType, index) => (
                          <Chip {...getTagProps({ index })} key={index} label={option.label} />
                        ))
                      }}
                      getOptionLabel={option => option.label || ''}
                      renderInput={params => (
                        <CustomTextField {...params} key={params.id} placeholder='Select category' label='Categories' />
                      )}
                    />
                  </Grid>
                )}

                {courseId && categoryId && (
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      id='sub-categories'
                      options={subCategories}
                      onChange={(event: ChangeEvent<{}>, newValue) => setSubCategoryId(newValue?.value)}
                      renderTags={(tagValue, getTagProps) => {
                        return tagValue.map((option: CategoryType, index) => (
                          <Chip {...getTagProps({ index })} key={index} label={option.label} />
                        ))
                      }}
                      getOptionLabel={option => option.label || ''}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          key={params.id}
                          placeholder='Select sub category'
                          label='Sub Category'
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Lectures id={courseId} />
    </>
  )
}
