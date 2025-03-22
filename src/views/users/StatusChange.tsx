'use client'
import React, { useMemo, useState } from 'react'

import { toast } from 'react-toastify'

import { Switch } from '@mui/material'

import { updateUserStatus } from '@/data/users/getUsers'

export default function StatusChange({ route, id, isActive }: { route: string; id: number; isActive: boolean }) {
  const ID = useMemo(() => id, [id])
  const [status, setStatus] = useState(isActive)

  const statusChange = async (ID: number) => {
    if (!status) {
      updateUserStatus(route, ID, true)
      setStatus(true)
    } else {
      updateUserStatus(route, ID, false)
      setStatus(false)
    }

    toast.success('User status has been updated')
  }

  return (
    <>
      <Switch color='success' checked={status} onChange={() => statusChange(ID)} />
    </>
  )
}
