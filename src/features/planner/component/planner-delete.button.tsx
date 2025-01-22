import { cn } from '@/lib/utils';
import { Employee } from '@/types/employee';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { calendarStore } from '../stores/calendar.store';

export type PlannerDeleteButtonProps = {
  isVisible: boolean;
  onDrop: (employees: Employee, dayId: string) => void;
};

export const PlannerDeleteButton = ({
  isVisible,
  onDrop,
}: PlannerDeleteButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const currentMonthDays = calendarStore((state) => state.currentMonthDays);

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ location, source }) => {
        const employee = source.data.employee as Employee;
        if (!employee) return;
        onDrop(employee, location.initial?.dropTargets?.[0]?.data.id as string);
      },
    });
  }, [currentMonthDays]);

  return (
    <div
      ref={ref}
      className={cn(
        'absolute transition-all duration-300  right-1/2 translate-x-1/2 flex items-center gap-2 opacity-70 bg-neutral-900 p-4 px-8 rounded-full',
        isVisible ? 'bottom-5' : '-bottom-20',
        isDraggedOver ? 'bg-red-500' : 'bg-neutral-900'
      )}
    >
      <Trash></Trash>
      <span>Delete</span>
    </div>
  );
};
