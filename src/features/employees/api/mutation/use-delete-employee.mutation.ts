import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openDB } from 'idb';
import { Employee } from '../../../../types/employee';
import { DB_NAME, DB_VERSION } from '@/App';
import { Day } from '@/types/day';

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-employee'],
    mutationFn: async (employee: Employee) => {
      const db = await openDB(DB_NAME, DB_VERSION);
      await db.delete('employees', employee.id);

      // delete from schedule days
      // create a transaction to check if the day have the employee and if so, remove it
      const transaction = db.transaction('days', 'readwrite');
      const days = (await transaction.objectStore('days').getAll()) as (Omit<
        Day,
        'employees'
      > & {
        employees: string[];
      })[];
      for (const day of days) {
        if (day.employees.some((e) => e === employee.id)) {
          day.employees = day.employees.filter((e) => e !== employee.id);
          await transaction.objectStore('days').put(day);
        }
      }
      await transaction.done;

      await queryClient.invalidateQueries({ queryKey: ['monthDays'] });
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
