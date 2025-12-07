export interface TasksStats {
	total: number
	done: number
	active: number
	overdue: number
	history: { day: string; count: number }[]
	avg_duration_hours: number
}

export interface TaskStatuses {
	created: number
	in_progress: number
	done: number
}

export interface TaskPriorities {
	low: number
	medium: number
	high: number
}

export interface ChecklistStats {
	total: number
	done: number
	overdue: number
	progress_percent: number
}

export interface HourActivity {
	[hour: number]: number
}

export interface UserStatistics {
	tasks: TasksStats
	task_statuses: TaskStatuses
	task_priorities: TaskPriorities
	checklist: ChecklistStats
	hour_activity: HourActivity
	productivity_index: number
}

export interface GroupTopUser {
  user_id: number
  name: string
  avatar: string | null
  tasks_done: number
  checklist_done: number
  productivity_index: number
}

export interface GroupTasksDynamicsPoint {
  day: string
  created: number
  done: number
  balance: number 
}

export interface GroupTasksDynamicsBySpace {
  space_id: number
  space_name: string
  dynamics: GroupTasksDynamicsPoint[]
}

export interface GroupWorkloadItem {
  user_id: number
  name: string
  avatar: string | null
  active_tasks: number
  due_soon_tasks: number
  checklist_active: number
}

export interface GroupSpaceStats {
  space_id: number
  space_name: string
  created: number
  done: number
  net: number
}

export interface GroupOverdueByUser {
  user_id: number
  name: string
  avatar: string | null
  overdue: number
}

export interface GroupOverdueBySpace {
  space_id: number
  space_name: string
  overdue: number
}

export interface GroupOverdueStats {
  total_overdue: number
  by_user: GroupOverdueByUser[]
  by_space: GroupOverdueBySpace[]
}

export interface GroupTeamHours {
  matrix: number[][]     // [weekday][hour] = count
  weekdays: string[]     // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  hours: number[]        // [0..23]
}

export interface GroupWorkloadItemWithTotal extends GroupWorkloadItem {
  total: number
}