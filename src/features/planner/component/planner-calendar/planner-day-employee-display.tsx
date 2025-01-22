import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip';
import { Employee } from '../../../../types/employee';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { cn } from '../../../../lib/utils';

export const PlannerEmployeeDisplay = ({
  employee,
}: {
  employee: Employee;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const initials = employee.name
    .split(' ')
    .map((name) => name[0])
    .join('.');

  useEffect(() => {
    const el = ref.current;

    if (el) {
      return draggable({
        element: el,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
        getInitialData: () => ({
          employee,
        }),
      });
    }
  }, []);

  return (
    <div ref={ref} className="relative w-fit h-fit">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-fit p-0 bg-transparent">
            <div
              className={cn(
                'w-8 h-8 bg-green-500 text-sm rounded-md flex items-center justify-center',
                isDragging && 'opacity-40'
              )}
            >
              <span>{initials.toUpperCase()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col gap-2 items-center">
            <p>{employee.name}</p>
            <p>{employee.phone}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
