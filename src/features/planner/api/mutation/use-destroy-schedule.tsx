import { useQueryClient } from '@tanstack/react-query';

import { DB_VERSION } from '@/App';

import { DB_NAME } from '@/App';

import { useMutation } from '@tanstack/react-query';
import { openDB } from 'idb';

export const useDestroyScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const db = await openDB(DB_NAME, DB_VERSION);
      await db.delete('schedules', scheduleId);
      queryClient.invalidateQueries({
        queryKey: ['schedules'],
      });
    },
  });
};
