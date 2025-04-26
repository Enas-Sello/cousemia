'use client'

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'
import { Drawer, IconButton, Typography, Divider, Button, Box, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { useMutation } from '@tanstack/react-query'

import CustomTextField from '@core/components/mui/TextField'
import { addNewNote } from '@/data/notes/notesQuery'
import type { NoteProps, NewNoteFormData } from '@/types/noteType'
import FiltersDataInput from '@/components/form-fields/FiltersDataInput'
import PdfUploadField from '@/components/form-fields/PdfUploadField'
import BasicFields from '@/components/form-fields/BasicFields'
import { NoteFormSchema } from '@/schema/NoteSchema/NoteFormSchema'

const AddNoteDrawer = ({ open, handleClose }: NoteProps) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewNoteFormData>({
    resolver: valibotResolver(NoteFormSchema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      pdf_type: 'url', // Default to URL
      course_id: 0,
      category_id: 0,
      sub_category_id: 0,
      is_free_content: '0',
      path: '',
      file: null,
    }
  })

  const pdfType = watch('pdf_type')

  // add new note mutation
  const { mutate: newNote, isPending: pendingNewNote } = useMutation({
    mutationFn: (data: FormData) => addNewNote(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Note added successfully');
      reset();
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add note');
    },
  });

  // Handle form submission
  const onSubmit = (data: NewNoteFormData) => {
    if (Object.keys(errors).length) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const formData: any = {
      title_en: data.title_en,
      title_ar: data.title_ar,
      video_thumb: "",
      pdf_type: data.pdf_type === "upload" ? "1" : "2",
      course_id: data.course_id.toString(),
      category_id: data.category_id.toString(),
      sub_category_id: data.sub_category_id.toString(),
      path: data.pdf_type === 'url' ? data.path : data.file,
      is_free_content: data.is_free_content,
      file: null, // default null
    };

    if (data.pdf_type === "upload") {
      formData.file = {
        $path: ""
      };
    }

    newNote(formData);
    console.log("Form data after submission:", formData);

  };


  const handleReset = () => {
    reset()
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Box className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New Note</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </Box>
      <Divider />
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 6 }}
      >
        <BasicFields control={control} errors={errors} />

        {/* PDF Type */}
        <Controller
          name='pdf_type'
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant='body2' sx={{ mb: 1 }}>Choose PDF Type</Typography>
              <RadioGroup
                {...field}
                row
                onChange={(e) => field.onChange(e.target.value)}
              >
                <FormControlLabel value='upload' control={<Radio />} label='Upload File' />
                <FormControlLabel value='url' control={<Radio />} label='Insert URL' />
              </RadioGroup>
              {errors.pdf_type && (
                <Typography color='error' variant='caption'>
                  {errors.pdf_type.message}
                </Typography>
              )}
            </Box>
          )}
        />

        {/* PDF Input */}
        {pdfType === 'upload' ? (
          <PdfUploadField
            control={control}
            name="file"
            setValue={setValue}
            route='notes'
          />
        ) : (
          <Controller
            name='path'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Enter PDF URL'
                error={!!errors.path}
                helperText={errors.path?.message}
              />
            )}
          />
        )}

        {/* Course, Category, Subcategory */}
        <FiltersDataInput
          courseId={watch('course_id')}
          categoryId={watch('category_id')}
          subCategoryId={watch('sub_category_id')}
          setCourseId={(id) => setValue('course_id', id ?? 0)}
          setCategoryId={(id) => setValue('category_id', id ?? 0)}
          setSubCategoryId={(id) => setValue('sub_category_id', id ?? 0)}
          drawer
        />

        {/* Is Free Content */}
        <Controller
          name='is_free_content'
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant='body2' sx={{ mb: 1 }}>Is Free Content</Typography>
              <RadioGroup
                {...field}
                row
                onChange={(e) => field.onChange(e.target.value)}
              >
                <FormControlLabel value='1' control={<Radio />} label='Yes' />
                <FormControlLabel value='0' control={<Radio />} label='No' />
              </RadioGroup>
              {errors.is_free_content && (
                <Typography color='error' variant='caption'>
                  {errors.is_free_content.message}
                </Typography>
              )}
            </Box>
          )}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='contained' type='submit' sx={{ flex: 1 }} disabled={pendingNewNote}>
            Add
          </Button>
          <Button variant='tonal' color='error' onClick={handleReset} sx={{ flex: 1 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default AddNoteDrawer
