'use client'

import React, { useRef, useState } from 'react'

import { Controller } from 'react-hook-form'
import { Box, Typography, Button } from '@mui/material'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react'

import Loading from '../loading'
import type { AudioFieldProps } from '@/types/audioType'
import { uploadAudio } from '@/data/media/mediaQuery'

const AudioRecordField: React.FC<AudioFieldProps> = ({
  control,
  fieldName,
  setValue,
  initialAudioUrl,
  label = 'Record Audio',
  route
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [audioName, setAudioName] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const uploadAudioMutation = useMutation({
    mutationFn: (file: File) => uploadAudio(file, route),
    onMutate: () => setIsUploading(true),
    onSuccess: (data: string) => {
      console.log('Audio uploaded successfully:', data);

      setValue(fieldName, data, { shouldValidate: true })
      toast.success('Audio uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload audio')
      setValue(fieldName, undefined, { shouldValidate: true })
      setAudioName(null)
    },
    onSettled: () => setIsUploading(false)
  })

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      audioChunks.current = []

      mediaRecorder.ondataavailable = event => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' })

        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: 'audio/webm'
        })

        setAudioName(file.name)
        uploadAudioMutation.mutate(file)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      toast.error('Microphone access denied or unavailable.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ fieldState: { error } }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">{label}</Typography>

          <Box
            sx={{
              border: '2px dashed',
              borderColor: isRecording ? 'error.main' : 'divider',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              backgroundColor: isRecording ? 'action.hover' : 'background.paper'
            }}
          >
            {isUploading ? (
              <Loading />
            ) : (
              <>
                <Button
                  variant="contained"
                  color={isRecording ? 'error' : 'primary'}
                  onClick={isRecording ? stopRecording : startRecording}
                  startIcon={isRecording ? <IconPlayerStop /> : <IconMicrophone />}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>

                {audioName && (
                  <Typography sx={{ mt: 2 }}>New recording: {audioName}</Typography>
                )}

                {initialAudioUrl && !audioName && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Current audio: {' '}
                      {typeof initialAudioUrl === 'string' ? initialAudioUrl : initialAudioUrl.name}

                  </Typography>
                )}
              </>
            )}
          </Box>

          {error && (
            <Typography variant="body2" color="error">
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  )
}

export default AudioRecordField
