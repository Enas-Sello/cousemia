import AxiosRequest from '@/libs/axios.config'

type QueryFnOptions = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  queryParams?: Record<string, any> 
  body?: any 
  headers?: Record<string, string> 
}

export const genericQueryFn = async ({ url, method = 'GET', queryParams = {}, body, headers }: QueryFnOptions) => {

  try {
    let finalUrl = url

    if (method === 'GET' && Object.keys(queryParams).length > 0) {
      const query = new URLSearchParams(queryParams).toString()

      finalUrl = `${url}?${query}`
    }

    const config = {
      headers: headers || {}
    }

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

    return response.data
    
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'An error occurred')
  }
}
