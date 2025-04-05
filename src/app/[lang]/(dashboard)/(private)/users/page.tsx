'use client'

import React, { useEffect, useState, useCallback } from 'react'

import UserListTable from '@/views/users/UserListTable'
import getUsers from '@/data/users/usersQuery'
import type { UserType } from '@/types/usertTypes'
import AnimationContainer from '@/@core/components/animation-container/animationContainer'

export default function Users() {
  const [data, setData] = useState<UserType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sortDesc, setSortDesc] = useState<string>('true')
  const [sortBy, setSortBy] = useState<string>('id')
  const [search, setSearch] = useState<string>('')
  const [verified, setVerified] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const fetchData = useCallback(async () => {
    const result = await getUsers(search, perPage, page + 1, sortBy, sortDesc, verified, status)

    setData(result.users)
    setTotal(result.total)
  }, [search, perPage, page, sortBy, sortDesc, verified, status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <AnimationContainer>
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
    </AnimationContainer>
  )
}
