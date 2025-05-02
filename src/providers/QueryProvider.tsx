'use client'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{children}
    <ReactQueryDevtools  initialIsOpen={false} />
  </QueryClientProvider>
}

export default QueryProvider
