import { DB_VERSION } from '@/App';
import { DB_NAME } from '@/App';
import { useQuery } from '@tanstack/react-query';
import { openDB } from 'idb';

export const useGetEmployeesQuery = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const db = await openDB(DB_NAME, DB_VERSION);
      return db.getAll('employees');
    },
  });
};
