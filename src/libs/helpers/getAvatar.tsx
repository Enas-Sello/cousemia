import CustomAvatar from '@/@core/components/mui/Avatar'

export const getAvatar = (params: Pick<{ image: string }, 'image'>) => {
  const { image } = params

  if (image) {
    return <CustomAvatar src={image} size={40} />
  }
}
