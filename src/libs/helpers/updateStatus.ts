import { genericQueryFn } from '../queryFn'

export const updateStatus = async (id: number, status: boolean, route: string): Promise<any> => {
  return genericQueryFn({
    url: `${route}/${id}`,
    method: 'PUT',
    body: { is_active: status }
  })
}
