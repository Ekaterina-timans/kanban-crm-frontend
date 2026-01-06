import { useQuery } from '@tanstack/react-query'
import { adminProfileService } from '@/services/admin-profile.service'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => adminProfileService.getProfile()
  })
}

export function useUpdateAdminProfile() {
  return useMutation({
    mutationFn: (formData: FormData) => adminProfileService.updateProfile(formData),
    onSuccess: () => toast.success('Профиль обновлён'),
    onError: () => toast.error('Ошибка при сохранении профиля')
  })
}
