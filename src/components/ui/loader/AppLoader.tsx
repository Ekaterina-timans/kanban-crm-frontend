import styles from './AppLoader.module.scss'

type Props = {
	title?: string
	subtitle?: string
}

export function AppLoader({
	title = 'Загрузка…',
	subtitle = 'FlowDesk подготавливает рабочее пространство'
}: Props) {
	return (
		<div className={styles.screen}>
			<div className={styles.card}>
				<div className={styles.kanban}>
					<div className={styles.col}>
						<div className={styles.colTitle} />
						<div className={styles.slot} />
					</div>

					<div className={styles.col}>
						<div className={styles.colTitle} />
						<div className={styles.slot} />
					</div>

					<div className={styles.col}>
						<div className={styles.colTitle} />
						<div className={styles.slot} />
					</div>

					<div className={styles.movingCard} />
				</div>

				<div className={styles.title}>{title}</div>
				<div className={styles.subtitle}>{subtitle}</div>
			</div>
		</div>
	)
}
