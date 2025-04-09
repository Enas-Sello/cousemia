// @/components/Header.tsx
import React from 'react'

import { useRouter } from 'next/navigation'

import { Typography, Breadcrumbs, Link, Button, Box } from '@mui/material'
import { IconChevronRight } from '@tabler/icons-react'

// Define the props for the Header component
interface Breadcrumb {
  label: string
  href?: string
}

interface HeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  showBackButton?: boolean
  actions?: React.ReactNode
}

const PageHeader: React.FC<HeaderProps> = ({ title, breadcrumbs = [], showBackButton = false, actions }) => {
  const router = useRouter()

  return (
    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        {/* Title */}
        <Typography variant='h4' sx={{ mb: 2 }}>
          {title}
        </Typography>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs separator={<IconChevronRight fontSize='small' />} aria-label='breadcrumb'>
            {breadcrumbs.map((breadcrumb, index) =>
              breadcrumb.href ? (
                <Link
                  key={index}
                  href={breadcrumb.href}
                  color='inherit'
                  underline='hover'
                  sx={{ fontSize: '0.875rem' }}
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <Typography key={index} color='text.primary' sx={{ fontSize: '0.875rem' }}>
                  {breadcrumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
      </Box>

      {/* Actions (Back Button or Custom Actions) */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {showBackButton && (
          <Button variant='outlined' onClick={() => router.back()}>
            Back
          </Button>
        )}
        {actions}
      </Box>
    </Box>
  )
}

export default PageHeader
