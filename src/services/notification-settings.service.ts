import { axiosRequest } from '@/api/interceptors'
import { INotificationSettings } from '@/types/notification-settings.types'

class NotificationSettingsService {
 private BASE_URL = '/notification-settings'

 async get() {
  const res = await axiosRequest.get<INotificationSettings>(this.BASE_URL)
  return res.data
 }

 async update(payload: Partial<INotificationSettings>) {
  const res = await axiosRequest.put<{
   message: string
   settings: INotificationSettings
  }>(this.BASE_URL, payload)
  return res.data.settings
 }
}

export const notificationSettingsService = new NotificationSettingsService()