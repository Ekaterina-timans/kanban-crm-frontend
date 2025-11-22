import { axiosRequest } from "@/api/interceptors"
import { IUserProfile } from "@/types/user.types"

class UserProfileService {
  private BASE = '/profile'

  /** Получить данные профиля */
  async getProfile(): Promise<IUserProfile> {
    const res = await axiosRequest.get<{ user: IUserProfile }>(this.BASE)
    return res.data.user
  }

  /** Обновить данные профиля */
  async updateProfile(formData: FormData): Promise<IUserProfile> {
    const res = await axiosRequest.post<{ user: IUserProfile }>(`${this.BASE}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.user
  }
}

export const userProfileService = new UserProfileService()