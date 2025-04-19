export type FormDataType = {
  content: string;
};

export type ConfigItem = {
  id: number;
  field_type: 'text' | 'text_editor' | 'number';
  type: string;
  field: string;
  label_en: string;
  label_ar: string;
  value_en: string;
  value_ar: string;
};

export type ConfigResponse = {
  data: ConfigItem[];
  message: string;
  status_code: number;
};

export type UpdateConfigData = ConfigItem[];
