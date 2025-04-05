'use client'

// React Imports
import { forwardRef } from 'react'

// Next Imports
import Link from 'next/link'
import type { LinkProps } from 'next/link'

// Type Imports
import type { ChildrenType } from '../types'

type RouterLinkProps = LinkProps &
  Partial<ChildrenType> & {
    className?: string
  }

export const RouterLink = forwardRef((props: RouterLinkProps, ref: any) => {
  const { href, className, ...other } = props
  const basePath = process.env.BASEPATH || '' // Use BASEPATH from env
  const adjustedHref = `${basePath}${href}` // Prepend basePath to href

  return (
    <Link
      ref={ref}
      href={adjustedHref}
      className={className}
      prefetch={true} // Force prefetching even in development
      {...other}
    >
      {props.children}
    </Link>
  )
})
