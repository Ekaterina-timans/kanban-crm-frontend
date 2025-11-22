import { PriorityId, StatusId } from "@/types/task.types";
import { AlarmClock, AlertTriangle, CheckCircle, FilePlus, Info, Loader2 } from "lucide-react";
import { ReactNode } from "react";

export const statuses: Record<StatusId, string> = {
  1: "Создано",
  2: "В процессе",
  3: "Завершено"
};

export const priorities: Record<PriorityId, string> = {
  1: "Несущественно",
  2: "Важно",
  3: "Срочно"
};

export const statusIcons: Record<StatusId, ReactNode> = {
  1: <FilePlus className="w-4 h-4 mr-1" />,
  2: <Loader2 className="w-4 h-4 mr-1" />,
  3: <CheckCircle className="w-4 h-4 mr-1" />
}

// Иконки для приоритетов
export const priorityIcons: Record<PriorityId, ReactNode> = {
  1: <Info className="w-4 h-4 mr-1" />,
  2: <AlertTriangle className="w-4 h-4 mr-1" />,
  3: <AlarmClock className="w-4 h-4 mr-1" />
}