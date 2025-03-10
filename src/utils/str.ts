export const strTruncate = (str: string, len: number = 15) => {
  return str?.length > len ? str.substring(0, len) + '...' : str
}
