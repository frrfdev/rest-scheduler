import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openDB } from 'idb';
import { Employee } from '../../../../types/employee';
import { makeRandomUUID } from '../../../../utils/utils';
import { DB_NAME } from '@/App';
import { DB_VERSION } from '@/App';

export const useStoreEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Employee) => {
      const db = await openDB(DB_NAME, DB_VERSION);
      const id = makeRandomUUID();
      await db.add('employees', { ...employee, id }, id);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
