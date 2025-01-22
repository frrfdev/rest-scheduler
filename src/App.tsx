import { EmployeesList } from './features/employees/components/employees.list';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlannerCalendar } from './features/planner/component/planner-calendar/planner-calendar';
import { openDB } from 'idb';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

export const DB_NAME = 'rest-scheduler';
export const DB_VERSION = 12;

openDB(DB_NAME, DB_VERSION, {
  async upgrade(db) {
    db.createObjectStore('employees');
    const schedulesStore = db.createObjectStore('schedules', { keyPath: 'id' });
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="flex w-full h-full overflow-hidden">
        <div className="bg-zinc-900 h-full w-fit p-4">
          <EmployeesList />
        </div>
        <div className="w-full flex justify-center items-center">
          <PlannerCalendar />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
