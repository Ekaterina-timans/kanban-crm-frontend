import { PriorityId, StatusId } from "@/types/task.types";

export const getBadgeColorStatus = (status_id: StatusId) => {
  switch (status_id) {
    case 2:
      return 'secondary';
    case 3:
      return 'primary';
    default:
      return 'default';
  }
};

export const getBadgeColorPriority = (priority_id: PriorityId) => {
  switch (priority_id) {
    case 2:
      return 'warning';
    case 3:
      return 'danger';
    default:
      return 'success';
  }
};