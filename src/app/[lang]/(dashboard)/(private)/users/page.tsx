'use client'

import React, { useEffect, useState } from 'react'

import { Grid } from '@mui/material'

import UserListTable from '@/views/users/UserListTable'
import getUsers from '@/data/users/getUsers'
import type { UserType } from '@/types/usertTypes'

export default function Users() {
  const [data, setData] = useState<UserType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sortDesc, setSortDesc] = useState<string>('true')
  const [sortBy, setSortBy] = useState<string>('id')
  const [verified, setVerified] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const fetchData = async () => {
    const result = await getUsers(search, perPage, page + 1, sortBy, sortDesc, verified, status) // page + 1 to match server-side pagination

    setData(result.users)
    setTotal(result.total) // total number of items
  }

  useEffect(() => {
    fetchData()
  }, [perPage, page, status, verified, search])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable
          tableData={data}
          total={total}
          perPage={perPage}
          setPerPage={setPerPage}
          page={page}
          setPage={setPage}
          setSortBy={setSortBy}
          setSortDesc={setSortDesc}
          setStatus={setStatus}
          setVerified={setVerified}
          setSearch={setSearch}
        />
      </Grid>
    </Grid>
  )
}
