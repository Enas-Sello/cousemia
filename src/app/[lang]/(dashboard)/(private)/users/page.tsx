'use client'

import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import AnimationContainer from '@/@core/components/animation-container/animationContainer'
import UserListTable from '@/views/users/UserListTable'
import { getUsers } from '@/data/users/usersQuery'
import PageHeader from '@/components/PageHeader'
import Loading from '@/components/loading'
import ErrorBox from '@/components/ErrorBox'

export default function Users() {
  const [perPage, setPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [sortDesc, setSortDesc] = useState<string>('true')
  const [sortBy, setSortBy] = useState<string>('id')
  const [search, setSearch] = useState<string>('')
  const [verified, setVerified] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  // Fetch users using useQuery
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', search, perPage, page, sortBy, sortDesc, verified, status],
    queryFn: async () => {
      return await getUsers(search, perPage, page + 1, sortBy, sortDesc, verified, status)
    }
  })

  const users = data?.users ?? []
  const total = data?.total ?? 0

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorBox refetch={refetch} error={error} />
  }

  return (
    <AnimationContainer>
      <PageHeader
        title='User List'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'User List' }]}
        showBackButton={true}
      />

      <UserListTable
        users={users}
        total={total}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
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
