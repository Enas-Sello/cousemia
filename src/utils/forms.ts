export const getFieldError = (errors: any, name: string) => ({
  error: !!errors[name],
  helperText: errors[name]?.message,
})
