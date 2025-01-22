import { DB_NAME, DB_VERSION } from '@/App';
import { Day } from '@/types/day';
import { Schedule } from '@/types/schedule';
import { useMutation } from '@tanstack/react-query';
import { openDB } from 'idb';

export const useStoreMonthDaysMutation = () => {
  return useMutation({
    mutationFn: async (
      days: (Omit<Day, 'employees'> & { employees: string[] })[]
    ) => {
      const db = await openDB(DB_NAME, DB_VERSION);
      const yearId = days[0].yearId;
      const yearNumber = yearId.split('-')[0];
      const monthId = days[0].monthId;
      const monthNumber = monthId.split('-')[0];
      const scheduleId = days[0].scheduleId;

      const scheduleExists = (await db.get(
        'schedules',
        scheduleId
      )) as Schedule;
      if (!scheduleExists)
        await db.add('schedules', {
          id: scheduleId,
          years: [yearId],
        });
      else
        await db.put('schedules', {
          ...scheduleExists,
          years: [...scheduleExists.years, yearId],
        });

      const daysMap = new Map(days.map((day) => [day.day, day.id]));
      const monthExists = await db.get('months', monthId);
      if (!monthExists)
        await db.add('months', {
          id: monthId,
          yearId: yearId,
          scheduleId: scheduleId,
          days: daysMap,
          month: monthNumber,
        });
      else
        await db.put('months', {
          ...monthExists,
          days: daysMap,
        });

      const yearExists = await db.get('years', yearId);
      if (!yearExists)
        await db.add('years', {
          id: yearId,
          scheduleId: scheduleId,
          year: yearNumber,
          months: [monthId],
        });
      else
        await db.put('years', {
          ...yearExists,
          months: [...yearExists.months, monthId],
        });

      const transaction = db.transaction('days', 'readwrite');
      for (const day of days) {
        const existingDay = await transaction.store.get(day.id);
        if (existingDay) await transaction.store.put(day);
        else await transaction.store.add(day);
      }
    },
  });
};
