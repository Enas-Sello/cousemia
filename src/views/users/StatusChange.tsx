'use client'
import React, { useMemo, useState } from 'react'

import { toast } from 'react-toastify'

import { Switch } from '@mui/material'

import { updateUserStatus } from '@/data/users/getUsers'

export default function StatusChange({ userID, isActive }: { userID: number; isActive: boolean }) {
  const id = useMemo(() => userID, [userID])
  const [status, setStatus] = useState(isActive)

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
      <Switch color='success' checked={status} onChange={() => statusChange(id)} />
    </>
  )
}
