import { axiosRequest } from '@/api/interceptors'
import { IAdminUser } from '@/types/admin-user.types'

class AdminProfileService {
  private BASE = '/admin/profile'

  async getProfile(): Promise<{ user: IAdminUser }> {
    const res = await axiosRequest.get(this.BASE)
    return res.data
  }

  async updateProfile(formData: FormData): Promise<{ message: string; user: IAdminUser }> {
    const res = await axiosRequest.post(this.BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  }
}

export const adminProfileService = new AdminProfileService()
