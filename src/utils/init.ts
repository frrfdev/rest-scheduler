import { DB_NAME, DB_VERSION } from '@/App';
import { openDB } from 'idb';

export const initDB = async () => {
  openDB(DB_NAME, DB_VERSION, {
    async upgrade(db) {
      db.createObjectStore('employees');
      const schedulesStore = db.createObjectStore('schedules', {
        keyPath: 'id',
      });
      schedulesStore.getAll().then((schedules) => {
        if (schedules.length === 0) {
          const defaultSchedule = {
            id: 'default',
            name: 'Default',
            years: [],
          };
          schedulesStore.add(defaultSchedule);
        }
      });
      db.createObjectStore('years', { keyPath: 'id' });
      db.createObjectStore('months', { keyPath: 'id' });
      const daysStore = db.createObjectStore('days', { keyPath: 'id' });
      daysStore.createIndex(
        'by_schedule_month_year',
        ['scheduleId', 'monthId', 'yearId'],
        { unique: false }
      );
    },
  });
};
