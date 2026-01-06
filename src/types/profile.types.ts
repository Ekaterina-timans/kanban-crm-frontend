export type ProfileUser = {
	name?: string | null
	email: string
	avatar?: string | FileList | null
	created_at?: string | null
}

export type ProfileFormValues = {
	name: string
	email: string
	password?: string
	avatar: FileList | null
}

export type ProfileFormProps = {
	title: string
	user: ProfileUser
	isLoading?: boolean
	isPending?: boolean
	onSubmit: (formData: FormData) => Promise<void> | void
}
