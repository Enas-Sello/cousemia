import type { UseFormSetValue } from "react-hook-form";

export type ImageType = {
  id: number
  mime_type: string
  url: string
  extension: string
  filename: string
  source_filename: string
}

export interface UploadedImage {
  id: number
  url: string
}

export interface ImageUploadFieldProps {
  control: any
  fieldName: string
  fieldId: string
  initialImageUrl?: string | null
  setValue: UseFormSetValue<any>
  label?: string
}
