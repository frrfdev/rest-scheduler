import { DB_NAME, DB_VERSION } from '@/App';
import { Day } from '@/types/day';
import { useQuery } from '@tanstack/react-query';
import { openDB } from 'idb';

type UseGetMonthDaysQueryProps = {
  monthId: string;
  yearId: string;
  scheduleId: string;
};

export const useGetMonthDaysQuery = ({
  monthId,
  yearId,
  scheduleId,
}: UseGetMonthDaysQueryProps) => {
  return useQuery({
    queryKey: ['monthDays', monthId, yearId, scheduleId],
    queryFn: async () => {
      const db = await openDB(DB_NAME, DB_VERSION);
      if (!scheduleId || !monthId || !yearId) {
        return [];
      }
      const days = (await db
        .transaction('days')
        .store.index('by_schedule_month_year')
        .getAll(IDBKeyRange.only([scheduleId, monthId, yearId]))) as Day[];

      const employees = await db.getAll('employees');
      const employeesMap = new Map(
        employees.map((employee) => [employee.id, employee])
      );

      const daysWithEmployees = days.map((day) => ({
        ...day,
        employees: day.employees.map((employee) => employeesMap.get(employee)),
      }));

      return daysWithEmployees;
    },
  });
};
