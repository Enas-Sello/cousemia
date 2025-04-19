import { API_CONFIG } from '@/configs/api'
import { genericQueryFn } from '@/libs/queryFn'
import type { ConfigResponse, UpdateConfigData } from '@/types/configTypes';

// Fetch the "Config" content
export const getConfig = async (): Promise<ConfigResponse> => {
  return genericQueryFn({
    url: API_CONFIG,
    method: 'GET'
  });
};


// Update the "Config" content
export const updateConfig = async (data: UpdateConfigData): Promise<ConfigResponse> => {
  return genericQueryFn({
    url: API_CONFIG,
    method: 'PUT',
    body: data
  });
};
