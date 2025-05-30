import { API_COUNTRIES } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'

// Fetch all countries
export const getCountries = async (
  queryString: Record<string, any> = {}
): Promise<{ countries: any[]; total: number }> => {
  return genericQueryFn({
    url: API_COUNTRIES,
    method: 'GET',
    queryParams: queryString
  })
}

// Function to fetch a country by ID
export const getCountryByID = async (id: string): Promise<CountryResponse> => {
  return genericQueryFn({
    url: `${API_COUNTRIES}/${id}`,
    method: 'GET'
  })
}

// Function to edit a country by ID
export const updateCountry = async (data: UpdateCountryData) => {
  return genericQueryFn({
    url: `${API_COUNTRIES}/${data.id}`,
    method: 'PUT',
    body: data
  })
}

export const deleteCountry = async (id: number) => {
  return genericQueryFn({
    url: `${API_COUNTRIES}/${id}`,
    method: 'DELETE'
  })
}

type UpdateCountryData = {
  id: number
  title_en: string
  title_ar: string
  country_code: string
  is_active: boolean
  flag?: string // URL of the uploaded flag
  flag_id?: string // ID of the uploaded flag (if applicable)
}

// Type for the country data
type Country = {
  id: number
  title_en: string
  title_ar: string
  country_code: string
  flag: string
  is_active: boolean
  status: string
}

// Type for the API response
type CountryResponse = {
  data: Country
  message: string
  status_code: number
}
