import { useEffect, useRef, useState } from 'react';
import { Employee } from '../../../types/employee';
import { useDeleteEmployeeMutation } from '../api/mutation/use-delete-employee.mutation';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { cn } from '../../../lib/utils';
import { Edit, Trash } from 'lucide-react';
import { EmployeesForm } from './employees.form';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type EmployeeCardProps = {
  employee: Employee;
};

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [isDragging, setIsDragging] = useState(false);

  const deleteEmployeeMutation = useDeleteEmployeeMutation();

  const handleDelete = async () => {
    await deleteEmployeeMutation.mutateAsync(employee);
    toast({
      title: 'Employee deleted',
      description: `❌ ${employee.name} has been deleted`,
    });
  };

  useEffect(() => {
    const el = ref.current;

    if (el) {
      return draggable({
        element: el,
        onDragStart: () => setIsDragging(true),
        onDrop: () => {
          setIsDragging(false);
        },
        getInitialData: () => ({
          employee,
        }),
      });
    }
  }, []);

  return (
    <div
      className={cn(
        'bg-neutral-800 w-full p-4 rounded-md flex items-center justify-between gap-2',
        isDragging ? 'opacity-40 cursor-grabbing' : 'cursor-grab'
      )}
      ref={ref}
    >
      {employee.name}
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="h-6 min-w-6 w-6 p-0"
        >
          <Trash></Trash>
        </Button>

        <EmployeesForm employee={employee}>
          <div
            className={cn(
              buttonVariants({ variant: 'warning' }),
              'h-6 min-w-6 w-6 p-0'
            )}
            tabIndex={0}
          >
            <Edit></Edit>
          </div>
        </EmployeesForm>
      </div>
    </div>
  );
};
