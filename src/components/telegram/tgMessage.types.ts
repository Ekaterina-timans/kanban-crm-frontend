export type TgAttachment =
	| {
			kind: 'photo'
			file_id?: string
			label: string
			file_name?: string
			size?: number
			mime?: string
	  }
	| {
			kind: 'document'
			file_id?: string
			label: string
			file_name?: string
			size?: number
			mime?: string
	  }
	| {
			kind: 'video'
			file_id?: string
			label: string
			file_name?: string
			size?: number
			mime?: string
	  }
	| {
			kind: 'voice'
			file_id?: string
			label: string
			file_name?: string
			size?: number
			mime?: string
	  }
	| {
			kind: 'sticker'
			file_id?: string
			label: string
			emoji?: string
			file_name?: string
			size?: number
			mime?: string
	  }
	| {
			kind: 'unknown'
			file_id?: string
			label: string
			file_name?: string
			size?: number
			mime?: string
	  }

export type DeliveryStatus = 'queued' | 'sent' | 'failed' | 'unknown'

export type DeliveryMeta = {
	status: DeliveryStatus
	error?: string
}
