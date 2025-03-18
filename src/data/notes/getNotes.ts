// D:\Projects\teamWork\cousema\src\data\nots\getNots.ts
import { API_NOTES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

const getNotes = async (
  q: string = '',
  perPage: number = 10,
  page: number = 1,
  sortBy: string = 'id',
  sortDesc: string = 'true',
  course: string = 'id',
  category: string = 'id',
  sub_category: string = 'id'
) => {
  return genericQueryFn({
    url: API_NOTES,
    method: 'GET',
    queryParams: { q, perPage, page, sortBy, sortDesc,course,category,sub_category }
  })
}

export default getNotes
