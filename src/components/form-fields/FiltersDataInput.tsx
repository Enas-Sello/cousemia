'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'
import { Autocomplete, Card, CardContent, CardHeader, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

import CustomTextField from '@/@core/components/mui/TextField'
import { getCategoriesByCourseID, getSubCategoryList } from '@/data/categories/categoriesQuerys'
import { getCourses } from '@/data/courses/coursesQuery'
import type { CourseType } from '@/types/courseType'
import type { CategoryType } from '@/types/categoryType'

interface FiltersDataInputProps {
  courseId: number | undefined
  categoryId: number | undefined
  subCategoryId?: number | undefined
  subCategory?: boolean
  setCourseId: (id: number | undefined) => void
  setCategoryId: (id: number | undefined) => void
  setSubCategoryId?: (id: number | undefined) => void
  drawer?: boolean
}

const FiltersDataInput: React.FC<FiltersDataInputProps> = ({
  courseId,
  setCourseId,
  categoryId,
  setCategoryId,
  setSubCategoryId,
  drawer = false,
  subCategoryId
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
  // if (coursesError) return <ErrorBox error={coursesError} />

  // Determine grid size based on drawer prop
  const gridSize = drawer ? { xs: 12 } : { xs: 12, sm: 6, md: 4 }

  // Add placeholders for missing categories and subcategories
  const categoriesWithPlaceholder = categoryData?.data || []

  if (categoryId && !categoriesWithPlaceholder.some(cat => cat.value === categoryId)) {
    categoriesWithPlaceholder.unshift({
      value: categoryId,
      label: `Unknown Category (${categoryId})`,
      parent_category: ''
    })
  }

  const subCategoriesWithPlaceholder = subCategoryData?.data || []

  if (subCategoryId && !subCategoriesWithPlaceholder.some(sub => sub.value === subCategoryId)) {
    subCategoriesWithPlaceholder.unshift({
      value: subCategoryId,
      label: `Unknown Subcategory (${subCategoryId})`,
      parent_category: ''
    })
  }

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
                    paddingRight: 0
                  }
                }
              : undefined
          }
        >
          {!drawer && <CardHeader title='Filters' className='pbe-4' />}
          <CardContent>
            <Grid container spacing={drawer ? 3 : 6}>
              {/* Courses Autocomplete */}
              <Grid size={gridSize}>
                <Autocomplete
                  id='courses'
                  options={courseData?.courses || []}
                  value={courseData?.courses.find(course => course.id === courseId) || null}
                  onChange={(event, newValue) => {
                    setCourseId(newValue?.id ?? undefined)
                    setCategoryId(undefined)
                    if (setSubCategoryId) setSubCategoryId(undefined)
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option: CourseType, index) => (
                      <Chip {...getTagProps({ index })} key={option.id} label={option.title_en} />
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
                  disabled={!!coursesError || coursesLoading}
                />
              </Grid>

              {/* Categories Autocomplete (shown if courseId exists) */}
              {courseId && (
                <Grid size={gridSize}>
                  <Autocomplete
                    id='categories'
                    options={categoriesWithPlaceholder}
                    value={categoriesWithPlaceholder.find(category => category.value === categoryId) || null}
                    onChange={(event, newValue) => {
                      setCategoryId(newValue?.value ?? undefined)
                      if (setSubCategoryId) setSubCategoryId(undefined)
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option: CategoryType, index) => (
                        <Chip {...getTagProps({ index })} key={option.value} label={option.label} />
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
                    options={subCategoriesWithPlaceholder}
                    value={
                      subCategoriesWithPlaceholder.find(subCategory => subCategory.value === subCategoryId) || null
                    }
                    onChange={(event, newValue) => setSubCategoryId?.(newValue?.value ?? undefined)}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option: CategoryType, index) => (
                        <Chip {...getTagProps({ index })} key={option.value} label={option.label} />
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
                    noOptionsText={subCategoriesWithPlaceholder.length === 0 ? 'No subcategories available' : undefined}
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
