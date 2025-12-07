import { HourActivityChart } from './widgets/HourActivityChart'
import { AvgDurationCard } from './widgets/AvgDurationCard'
import { ChecklistPieChart } from './widgets/ChecklistPieChart'
import { ChecklistProgressCard } from './widgets/ChecklistProgressCard'
import { PriorityPieChart } from './widgets/PriorityPieChart'
import { ProductivityIndexCard } from './widgets/ProductivityIndexCard'
import { StatusPieChart } from './widgets/StatusPieChart'
import { TasksLineChart } from './widgets/TasksLineChart'
import { TasksSummaryCard } from './widgets/TasksSummaryCard'

export function PersonalStatistics() {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{/* Количество задач */}
			<TasksSummaryCard />

			{/* Линейный график */}
			<TasksLineChart />

			{/* Диаграмма статусов */}
			<StatusPieChart />

			{/* Диаграмма приоритетов */}
			<PriorityPieChart />

			{/* Среднее время выполнения */}
			<AvgDurationCard />

			{/* Прогресс чек-листов */}
			<ChecklistProgressCard />

			{/* Просроченные чек-листы */}
			<ChecklistPieChart />

			{/* Часовая активность */}
			<HourActivityChart />

			{/* Индекс продуктивности */}
			<ProductivityIndexCard />
		</div>
	)
}
