import { Loader } from '@/components/ui/loader';
import { buttonVariants } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { useGetEmployeesQuery } from '../api/query/use-get-employees.query';
import { EmployeeCard } from './employee.card';
import { EmployeesForm } from './employees.form';

export const EmployeesList = () => {
  const getEmployeesQuery = useGetEmployeesQuery();

  const employees = getEmployeesQuery.data;

  return (
    <Loader isVisible={getEmployeesQuery.isLoading}>
      <div className="min-w-[300px]">
        <EmployeesForm>
          <div
            className={cn(buttonVariants({ variant: 'success' }), 'w-full')}
            tabIndex={0}
          >
            Create Employee
          </div>
        </EmployeesForm>
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full w-full p-4">
          {employees?.map((employee) => (
            <li key={employee.id} className="text-white">
              <EmployeeCard employee={employee} />
            </li>
          ))}
        </ul>
      </div>
    </Loader>
  );
};
