'use client'
import React, { useMemo, useState } from 'react'

import { toast } from 'react-toastify'

import { Switch } from '@mui/material'

import { updateUserStatus } from '@/data/users/getUsers'

export default function StatusChange({ row }: { row: any }) {
  const id: number = useMemo(() => row.original.id, [row])
  const [status, setStatus] = useState(row.original.is_active)

  const statusChange = async (id: number) => {
    if (!status) {
      updateUserStatus(id, true)
      setStatus(true)
    } else {
      updateUserStatus(id, false)
      setStatus(false)
    }

    toast.success('User status has been updated')
  }

  return (
    <>
      <Switch color='primary' checked={status} onChange={() => statusChange(id)} />
    </>
  )
}
