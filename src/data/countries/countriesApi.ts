import { API_COUNTRIES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch all countries
export const getCountries = async (
  queryString: Record<string, any> = {}
): Promise<{ countries: any[]; total: number }> => {
  console.log(queryString)

  return genericQueryFn({
    url: API_COUNTRIES,
    method: 'GET',
    queryParams: queryString
  })
}

