import './globals.css';
import React, { Fragment } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      <Fragment>{children}</Fragment>
    </Fragment>
  );
}
