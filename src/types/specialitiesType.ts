export type SpecialityType = {
  id: number
  title_en: string
  title_ar: string
  image: string
  is_active: boolean
status: 'active' | 'not_active';
}
export type SpecialitiesResponse = {
  specialities: SpecialityType[];
  total: number;
};
