import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openDB } from 'idb';
import { Employee } from '../../../../types/employee';
import { DB_VERSION } from '@/App';
import { DB_NAME } from '@/App';

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Employee) => {
      const db = await openDB(DB_NAME, DB_VERSION);
      await db.put('employees', employee, employee.id);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
