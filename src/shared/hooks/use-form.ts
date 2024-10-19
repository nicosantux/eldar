import { useState, useRef, type FormEvent, useEffect } from 'react'

import { type ZodType } from 'zod'

type FormErrors = Partial<Record<string, string[]>>

interface UseAuthFormOptions<T> {
  onSubmit: (data: T, signal?: AbortSignal) => Promise<void>
  validationSchema: ZodType<T>
}

export function useForm<T>({ validationSchema, onSubmit }: UseAuthFormOptions<T>) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = Object.fromEntries(new FormData(event.currentTarget))

    const formValidation = validationSchema.safeParse(formData)

    if (!formValidation.success) {
      const { fieldErrors } = formValidation.error.flatten()

      setErrors(fieldErrors as FormErrors)

      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await onSubmit(formValidation.data, abortControllerRef.current?.signal)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ form: [error.message] })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    errors,
    handleSubmit,
    isSubmitting,
  }
}
