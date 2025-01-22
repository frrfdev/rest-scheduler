import { DB_NAME, DB_VERSION } from '@/App';
import { useQuery } from '@tanstack/react-query';
import { openDB } from 'idb';

export const useGetSchedulesQuery = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const db = await openDB(DB_NAME, DB_VERSION);
      return db.getAll('schedules');
    },
  });
};
