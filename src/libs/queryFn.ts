import AxiosRequest from '@/libs/axios.config'

// Define a type for the query function arguments
type QueryFnOptions = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  queryParams?: Record<string, any> // For query string parameters
  body?: any // For POST/PUT request bodies
  headers?: Record<string, string> // For custom headers (e.g., file uploads)
}

// Generic query function for React Query
export const genericQueryFn = async ({ url, method = 'GET', queryParams = {}, body, headers }: QueryFnOptions) => {

  try {
    // Build query string for GET requests
    let finalUrl = url

    if (method === 'GET' && Object.keys(queryParams).length > 0) {
      const query = new URLSearchParams(queryParams).toString()

      finalUrl = `${url}?${query}`
    }

    // Configure the Axios request
    const config = {
      headers: headers || {}
    }

    // Make the request based on the method
    let response

    switch (method) {
      case 'GET':
        response = await AxiosRequest.get(finalUrl, config)
        break
      case 'POST':
        response = await AxiosRequest.post(finalUrl, body, config)
        break
      case 'PUT':
        response = await AxiosRequest.put(finalUrl, body, config)
        break
      case 'DELETE':
        response = await AxiosRequest.delete(finalUrl, config)
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }

    // Return the response data
    return response.data
  } catch (error: any) {
    // React Query expects errors to be thrown for proper error handling
    throw new Error(error.response?.data?.message || error.message || 'An error occurred')
  }
}
