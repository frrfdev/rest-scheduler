import { EmployeesList } from './features/employees/components/employees.list';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlannerCalendar } from './features/planner/component/planner-calendar/planner-calendar';
import { Toaster } from './components/ui/toaster';
import { initDB } from './utils/init';
import { TutorialModal } from '@/features/components/tutorial-modal';

const queryClient = new QueryClient();

export const DB_NAME = 'rest-scheduler';
export const DB_VERSION = 12;

initDB();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="flex w-full h-full overflow-hidden" id="#root">
        <div className="bg-zinc-900 h-full w-fit p-4">
          <EmployeesList />
        </div>
        <div className="w-full flex justify-center items-center">
          <PlannerCalendar />
        </div>
      </div>
      <TutorialModal />
    </QueryClientProvider>
  );
}

export default App;
