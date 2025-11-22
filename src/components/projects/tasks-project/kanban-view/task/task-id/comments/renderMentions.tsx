import { Mention } from '@/components/ui/mention/Mention'

export function renderMentions(content: string, mentionedUsers: any[]) {
	if (!content) return null
	if (!mentionedUsers?.length) return content

	let parts: (string | JSX.Element)[] = [content]

	for (const user of mentionedUsers) {
		const name = user.name || user.email
		if (!name) continue

		const regex = new RegExp(`@${name}\\b`, 'g')
		const nextParts: (string | JSX.Element)[] = []

		for (const part of parts) {
			if (typeof part === 'string') {
				let lastIndex = 0
				let match
				while ((match = regex.exec(part)) !== null) {
					if (match.index > lastIndex)
						nextParts.push(part.slice(lastIndex, match.index))
					nextParts.push(
						<Mention
							key={`${user.id}-${match.index}`}
							user={user}
						/>
					)
					lastIndex = match.index + match[0].length
				}
				if (lastIndex < part.length) nextParts.push(part.slice(lastIndex))
			} else {
				nextParts.push(part)
			}
		}

		parts = nextParts
	}

	return parts
}
