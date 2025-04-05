'use client'

import type { ChangeEvent } from 'react'
import React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Autocomplete, Card, CardContent, CardHeader, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import { getCategoriesByCourseID, getSubCategoryList } from '@/data/categories/categoriesQuerys'
import type { CourseType } from '@/types/courseType'
import type { CategoryType } from '@/types/categoryType'
import { getCourses } from '@/data/courses/coursesQuery'

interface FiltersDataInputProps {
  courseId: number | undefined
  categoryId: number | undefined
  subCategory?: boolean | true
  setCategoryId: (id: number | undefined) => void
  setSubCategoryId?: (id: number | undefined) => void
  setCourseId: (id: number | undefined) => void
  drawer?: boolean | false
}

const FiltersDataInput: React.FC<FiltersDataInputProps> = ({
  courseId,
  setCourseId,
  categoryId,
  setCategoryId,
  setSubCategoryId,
  drawer
}) => {
  // Fetch courses
  const {
    data: courseData,
    isLoading: coursesLoading,
    error: coursesError
  } = useQuery<{ courses: CourseType[] }, Error>({
    queryKey: ['courses'],
    queryFn: () => getCourses()
  })

  // Fetch categories (depends on courseId)
  const {
    data: categoryData,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery<{ data: CategoryType[] }, Error>({
    queryKey: ['categories', courseId],
    queryFn: () => getCategoriesByCourseID(courseId!),
    enabled: !!courseId
  })

  // Fetch subcategories (depends on courseId and categoryId)
  const {
    data: subCategoryData,
    isLoading: subCategoriesLoading,
    error: subCategoriesError
  } = useQuery<{ data: CategoryType[] }, Error>({
    queryKey: ['subcategories', courseId, categoryId],
    queryFn: () => getSubCategoryList(courseId!, categoryId!),
    enabled: !!courseId && !!categoryId
  })

  // Handle error states
  if (coursesError) return <div>Error loading courses: {coursesError.message}</div>

  // Determine grid size based on drawer prop
  const gridSize = drawer ? { xs: 12 } : { xs: 12, sm: 6, md: 4 }

  return (
    <Grid container spacing={drawer ? 0 : 6} className='mb-6'>
      <Grid size={{ xs: 12 }}>
        <Card
          sx={
            drawer
              ? {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  '& .MuiCardContent-root': {
                    paddingLeft: 0,
                    paddingright: 0
                  }
                }
              : undefined
          }
        >
          {!drawer && <CardHeader title='Filters' className='pbe-4' />}
          <CardContent >
            <Grid container spacing={drawer ? 3 : 6}>
              {/* Courses Autocomplete */}
              <Grid size={gridSize}>
                <Autocomplete
                  id='courses'
                  options={courseData?.courses || []}
                  onChange={(event: ChangeEvent<{}>, newValue) => setCourseId(newValue?.id ?? 0)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option: CourseType, index) => (
                      <Chip {...getTagProps({ index })} key={index} label={option.title_en} />
                    ))
                  }
                  getOptionLabel={option => option.title_en || ''}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      placeholder='Select course'
                      label='Course'
                      sx={
                        drawer
                          ? {
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'background.paper'
                              }
                            }
                          : undefined
                      }
                    />
                  )}
                  disabled={coursesLoading}
                />
              </Grid>

              {/* Categories Autocomplete (shown if courseId exists) */}
              {courseId && (
                <Grid size={gridSize}>
                  <Autocomplete
                    id='categories'
                    options={categoryData?.data || []}
                    onChange={(event: ChangeEvent<{}>, newValue) => setCategoryId(newValue?.value ?? undefined)}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option: CategoryType, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option.label} />
                      ))
                    }
                    getOptionLabel={option => option.label || ''}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        placeholder='Select category'
                        label='Categories'
                        error={!!categoriesError}
                        helperText={categoriesError?.message}
                        sx={
                          drawer
                            ? {
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'background.paper'
                                }
                              }
                            : undefined
                        }
                      />
                    )}
                    disabled={categoriesLoading}
                  />
                </Grid>
              )}

              {/* Subcategories Autocomplete (shown if courseId and categoryId exist) */}
              {subCategoryData?.data && courseId && categoryId && (
                <Grid size={gridSize}>
                  <Autocomplete
                    id='sub-categories'
                    options={subCategoryData?.data || []}
                    onChange={(event: ChangeEvent<{}>, newValue) => setSubCategoryId?.(newValue?.value ?? undefined)}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option: CategoryType, index) => (
                        <Chip {...getTagProps({ index })} key={index} label={option.label} />
                      ))
                    }
                    getOptionLabel={option => option.label || ''}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        placeholder='Select sub category'
                        label='Sub Category'
                        error={!!subCategoriesError}
                        helperText={subCategoriesError?.message}
                        sx={
                          drawer
                            ? {
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'background.paper'
                                }
                              }
                            : undefined
                        }
                      />
                    )}
                    disabled={subCategoriesLoading}
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
