'use client'

import React, { useEffect, useState } from 'react'

import type { ChangeEvent } from 'react'

import { Autocomplete, Card, CardContent, CardHeader, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import type { CourseType } from '@/types/courseType'
import type { CategoryType } from '@/types/categoryType'
import { getCourses } from '@/data/courses/getCourses'
import { getCategoriesByCourseID, getSubCategoryList } from '@/data/categories/getCategories'

interface FiltersDataInputProps {
  courseId: number | undefined
  setCourseId: (id: number) => void
}

const FiltersDataInput: React.FC<FiltersDataInputProps> = ({ courseId, setCourseId }) => {
  const [courses, setCourses] = useState<CourseType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])

  const [subCategoryId, setSubCategoryId] = useState<number>()
  const [categoryId, setCategoryId] = useState<number>()
  const [subCategories, setSubCategories] = useState<CategoryType[]>([])

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
    <Grid container spacing={6} className='mb-6'>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Filters' className='pbe-4' />
          <CardContent className='border-bs py-6'>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 4 }}>
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
                <Grid size={{ xs: 12, sm: 4 }}>
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
                <Grid size={{ xs: 12, sm: 4 }}>
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
  )
}

export default FiltersDataInput
