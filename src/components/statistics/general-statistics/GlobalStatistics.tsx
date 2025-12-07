import { GroupOverdueCard } from "./widgets/GroupOverdueCard";
import { GroupSpacesStatsChart } from "./widgets/GroupSpacesStatsChart";
import { GroupTasksDynamicsBySpaceChart } from "./widgets/GroupTasksDynamicsBySpaceChart";
import { GroupTeamHoursHeatmap } from "./widgets/GroupTeamHoursHeatmap";
import { GroupTopUsersCard } from "./widgets/GroupTopUsersCard";
import { GroupWorkloadWidget } from "./widgets/GroupWorkloadWidget";

export function GlobalStatistics() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* ТОП участников по активности */}
      <GroupTopUsersCard />

      {/* Динамика задач по пространствам */}
      <GroupTasksDynamicsBySpaceChart />

      {/* Загруженность участников */}
      <GroupWorkloadWidget />

      {/* Самые активные проекты */}
			<GroupSpacesStatsChart />

      {/* Проблемные зоны */}
			<GroupOverdueCard />

      {/* Рабочие часы команды */}
			<GroupTeamHoursHeatmap />
    </div>
  )
}