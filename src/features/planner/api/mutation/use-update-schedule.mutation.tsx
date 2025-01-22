import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DB_VERSION } from '@/App';
import { DB_NAME } from '@/App';

import { Schedule } from '@/types/schedule';
import { openDB } from 'idb';

export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: Schedule) => {
      console.log(schedule);
      const db = await openDB(DB_NAME, DB_VERSION);
      await db.put('schedules', schedule);
      queryClient.invalidateQueries({
        queryKey: ['schedules'],
      });
    },
  });
};
