// D:\Projects\teamWork\cousema\src\app\[lang]\nots\page.tsx
'use client'

import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import getNotes from '@/data/notes/getNotes'

import LoadingSkeleton from '@/@layouts/components/LoadingSkeleton'
import NotesList from '@/views/notes/NotesList'

export default function Notes() {
  // State for query parameters
  const [search, setSearch] = useState<string>('')
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0) // 0-based index, +1 in fetch
  const [sortBy, setSortBy] = useState<string>('id')
  const [sortDesc, setSortDesc] = useState<string>('true')
  const [course, setCourse] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [subCategory, setSubCategory] = useState<string>('')

  // Fetch data with React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'NOTES',
      {
        search,
        perPage,
        page: page + 1,
        sortBy,
        sortDesc,
        course,
        category,
        subCategory
      }
    ],
    queryFn: () => getNotes(search, perPage, page + 1, sortBy, sortDesc, course, category, subCategory),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Handle loading and error states
  if (isLoading) return <LoadingSkeleton />
  if (isError) return <div>Error: {(error as Error).message}</div>

  // Destructure data (assuming { notes, total } structure)
  const notes = data?.notes || []
  const total = data?.total || 0

  console.log(notes)

  return (
    <NotesList
      tableData={notes}
      total={total}
      perPage={perPage}
      setPerPage={setPerPage}
      page={page}
      setPage={setPage}
      setSortBy={setSortBy}
      setSortDesc={setSortDesc}
      setSearch={setSearch}
      setCourse={setCourse}
      setCategory={setCategory}
      setSubCategory={setSubCategory}
      course={course}
      category={category}
    />
  )
}
