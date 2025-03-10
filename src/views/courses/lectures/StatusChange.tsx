'use client'
import React, { useMemo, useState } from 'react'

import { toast } from 'react-toastify'

import { Switch } from '@mui/material'

import { updateLectureStatus } from '@/data/courses/getLectures'

export default function StatusChange({ row }: { row: any }) {
  const id: number = useMemo(() => row.original.id, [row])
  const [status, setStatus] = useState(row.original.is_active)

  const statusChange = async (id: number) => {
    if (!status) {
      updateLectureStatus(id, true)
      setStatus(true)
    } else {
      updateLectureStatus(id, false)
      setStatus(false)
    }

    toast.success('Lecture status has been updated')
  }

  return (
    <>
      <Switch color='primary' checked={status} onChange={() => statusChange(id)} />
    </>
  )
}
