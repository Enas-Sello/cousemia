export type EditorResponse = {
  data: {
    content: string
  }
  message: string
  status_code: number
}

export type UpdateEditorData = {
  content: string
}

export type FormDataType = {
  content: string
}
