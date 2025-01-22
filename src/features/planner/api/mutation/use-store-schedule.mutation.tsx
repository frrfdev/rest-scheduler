import { DB_NAME, DB_VERSION } from '@/App';
import { makeRandomUUID } from '@/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openDB } from 'idb';

export const useStoreScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: { name: string }) => {
      const db = await openDB(DB_NAME, DB_VERSION);
      const id = makeRandomUUID();
      await db.add('schedules', { ...schedule, id, years: [] });
      queryClient.invalidateQueries({ queryKey: ['schedules'] });

      return { ...schedule, id, years: [] };
    },
  });
};
