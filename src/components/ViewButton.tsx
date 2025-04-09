import Link from 'next/link'

import { IconButton, Tooltip } from '@mui/material'

const ViewButton = ({ link, Tooltiptitle }: { link: string; Tooltiptitle: string }) => {
  return (
    <Tooltip title={Tooltiptitle} arrow>
      <IconButton>
        <Link href={link} className='flex justify-center items-center'>
          <i className='tabler-eye text-[18px] text-textSecondary' />
        </Link>
      </IconButton>
    </Tooltip>
  )
}

export default ViewButton
