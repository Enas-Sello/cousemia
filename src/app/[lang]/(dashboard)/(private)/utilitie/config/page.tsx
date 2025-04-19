'use client';

import { useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { object, string } from 'valibot';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, TextField, Button, Divider, CircularProgress } from '@mui/material';

import { getConfig, updateConfig } from '@/data/config/configQuery';
import type { ConfigItem, ConfigResponse } from '@/types/configTypes';
import type { FormDataType as OriginalFormDataType } from '@/types/editor';

type FormDataType = OriginalFormDataType & {
  [key: string]: string;
};

const createSchema = (configItems: ConfigItem[]) => {
  const shape: Record<string, any> = {};

  configItems.forEach(item => {
    if (item.field_type !== 'text_editor') { // Exclude text_editor fields from schema
      shape[item.field] = string();
    }
  });
  
return object(shape);
};

export default function ConfigPage() {
  const queryClient = useQueryClient();

  // Fetch configuration data
  const { data: configData, isLoading, error, refetch } = useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
  });

  // Form setup
  const {
    control,
    handleSubmit,
    reset,

    //@ts-ignore
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: configData ? valibotResolver(createSchema(configData.data)) : undefined,
    defaultValues: {},
  });

  // Populate form with fetched data
  useEffect(() => {
    if (configData) {
      const defaultValues: Record<string, string> = {};

      configData.data.forEach(item => {
        if (item.field_type !== 'text_editor') { // Exclude text_editor fields
          defaultValues[item.field] = item.value_en || '';
        }
      });
      reset(defaultValues);
    }
  }, [configData, reset]);

  // Mutation for updating config
  const updateMutation = useMutation({
    mutationFn: (data: ConfigItem[]) => updateConfig(data),
    onSuccess: (response: ConfigResponse) => {
      toast.success(response.message || 'Configuration updated successfully');
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update configuration');
    },
  });

  // Handle form submission
  const onSubmit = (data: FormDataType) => {
    if (!configData) return;

    // Transform the form data into the correct payload format
    const updatedPayload: ConfigItem[] = configData.data
      .filter(item => item.field_type !== 'text_editor') // Exclude text_editor fields
      .map(item => ({
        id: item.id,
        field_type: item.field_type,
        type: item.type,
        field: item.field,
        label_en: item.label_en,
        label_ar: item.label_ar,
        value_en: data[item.field] || item.value_en, // Use updated value from form
        value_ar: item.value_ar, // Keep value_ar unchanged (or update if needed)
      }));

    updateMutation.mutate(updatedPayload);
  };

  // Handle form reset
  const handleReset = () => {
    const defaultValues: Record<string, string> = {};

    configData?.data.forEach(item => {
      if (item.field_type !== 'text_editor') {
        defaultValues[item.field] = item.value_en || '';
      }
    });
    reset(defaultValues);
  };

  // Group config items by type, excluding text_editor fields
  const groupedConfig = configData?.data
    .filter(item => item.field_type !== 'text_editor')
    .reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }

      acc[item.type].push(item);
      
return acc;
    }, {} as Record<string, ConfigItem[]>);

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error: {error.message || 'Failed to load configuration'}
        </Typography>
        <Button variant="outlined" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Configuration Settings
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {groupedConfig &&
          Object.entries(groupedConfig).map(([type, items]) => (
            <Box key={type} sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                {type}
              </Typography>
              <Divider sx={{ mb: 3, borderColor: 'grey.700' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map(item => (
                  <Box key={item.field}>
                    <Controller
                      name={item.field}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={item.label_en}
                          value={field.value || ''}
                          onChange={field.onChange}
                          fullWidth
                          type={item.field_type === 'number' ? 'number' : 'text'}
                          error={!!errors[item.field]}
                          helperText={errors[item.field]?.message}
                          InputLabelProps={{ style: { color: 'white' } }}
                          InputProps={{ style: { color: 'white', borderColor: 'grey.700' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'grey.700' },
                              '&:hover fieldset': { borderColor: 'grey.500' },
                              '&.Mui-focused fieldset': { borderColor: 'grey.300' },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
          <Button
            disabled={updateMutation.isPending}
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#e91e63', '&:hover': { backgroundColor: '#d81b60' }, flex: 1 }}
          >
            {updateMutation.isPending ? 'Saving...' : 'Submit'}
          </Button>
          <Button
            disabled={updateMutation.isPending}
            type="button"
            variant="outlined"
            onClick={handleReset}
            sx={{ flex: 1, color: 'white', borderColor: 'grey.700', '&:hover': { borderColor: 'grey.500' } }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
