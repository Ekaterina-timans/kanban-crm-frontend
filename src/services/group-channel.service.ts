import {
	IGroupChannel,
	TelegramConnectPayload
} from '@/types/integration.types'

import { axiosRequest } from '@/api/interceptors'

class GroupChannelService {
	private BASE_URL = '/groups'

	async list(groupId: string | number) {
		const { data } = await axiosRequest.get<IGroupChannel[]>(
			`${this.BASE_URL}/${groupId}/channels`
		)
		return data
	}

	async create(
		groupId: string | number,
		payload: { provider: string; display_name: string }
	) {
		const { data } = await axiosRequest.post<IGroupChannel>(
			`${this.BASE_URL}/${groupId}/channels`,
			payload
		)
		return data
	}

	async update(
		groupId: string | number,
		channelId: string | number,
		payload: Partial<
			Pick<IGroupChannel, 'display_name' | 'status' | 'settings'>
		>
	) {
		const { data } = await axiosRequest.patch<{
			message: string
			channel: IGroupChannel
		}>(`${this.BASE_URL}/${groupId}/channels/${channelId}`, payload)
		return data
	}

	async remove(groupId: string | number, channelId: string | number) {
		const { data } = await axiosRequest.delete<{ ok: true }>(
			`${this.BASE_URL}/${groupId}/channels/${channelId}`
		)
		return data
	}

	async connectTelegram(
		groupId: string | number,
		channelId: string | number,
		payload: TelegramConnectPayload
	) {
		const { data } = await axiosRequest.post<{
			ok: true
			channel: IGroupChannel
		}>(
			`${this.BASE_URL}/${groupId}/channels/${channelId}/connect/telegram`,
			payload
		)
		return data
	}

	async disconnectTelegram(
		groupId: string | number,
		channelId: string | number
	) {
		const { data } = await axiosRequest.post<{
			ok: true
			channel: IGroupChannel
		}>(`${this.BASE_URL}/${groupId}/channels/${channelId}/disconnect/telegram`)
		return data
	}
}

export const groupChannelService = new GroupChannelService()
