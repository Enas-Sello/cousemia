'use client'
import React, { useMemo, useState } from 'react'

import { toast } from 'react-toastify'

import { Switch } from '@mui/material'

import { updateStatus } from '@/libs/helpers/updateStatus'
import { API_COURSES, API_FLASH_CARDS, API_LECTURES, API_SPECIALTIES } from '@/configs/api'

interface StatusChangeProps {
  row: { original: { id: number; is_active: boolean } } | { id: number; is_active: boolean }
  type: 'Lecture' | 'course' | 'flashcard' | 'specialities'
}

export default function StatusChanger({ row, type }: StatusChangeProps) {
  let route: string

  switch (type) {
    case 'Lecture':
      route = API_LECTURES
      break
    case 'course':
      route = API_COURSES
      break
    case 'flashcard':
      route = API_FLASH_CARDS
      break
    case 'specialities':
      route = API_SPECIALTIES
      break
    default:
      route = API_COURSES
      break
  }

  const id: number = useMemo(() => ('original' in row ? row.original.id : row.id), [row])
  const [status, setStatus] = useState('original' in row ? row.original.is_active : row.is_active)

  const statusChange = async (id: number) => {
    try {
      if (!status) {
        await updateStatus(id, true, route)
        setStatus(true)
      } else {
        await updateStatus(id, false, route)
        setStatus(false)
      }

      toast.success('Status has been updated')
    } catch (error) {
      toast.error('Failed to update status')
      console.error('Status update error:', error)
    }
  }

  return <Switch color='primary' checked={status} onChange={() => statusChange(id)} />
}
