import { Loader } from '@/components/ui/loader';
import { Button } from '../../../components/ui/button';
import { useGetEmployeesQuery } from '../api/query/use-get-employees.query';
import { EmployeeCard } from './employee.card';
import { EmployeesForm } from './employees.form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const EmployeesList = () => {
  const getEmployeesQuery = useGetEmployeesQuery();

  const [search, setSearch] = useState('');

  const employees = getEmployeesQuery.data;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Loader isVisible={getEmployeesQuery.isLoading}>
      <div className="min-w-[300px]">
        <EmployeesForm>
          <Button variant={'success'} className="w-full" id="new-employee">
            Create Employee
          </Button>
        </EmployeesForm>
        <Input placeholder="Search" onChange={handleSearch} className="mt-4" />
        <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full w-full py-4">
          {employees
            ?.filter((employee) =>
              employee.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((employee) => (
              <li key={employee.id} className="text-white">
                <EmployeeCard employee={employee} />
              </li>
            ))}
        </ul>
      </div>
    </Loader>
  );
};
