import type { UseFormSetValue } from "react-hook-form";

export type AudioFieldProps = {
  control: any;
  fieldName: string;
  setValue: UseFormSetValue<any>
  initialAudioUrl?: string | File | null;
  label?: string;
  route: string; 
}
