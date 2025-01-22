import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../../lib/utils';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Day } from '../../../../types/day';
import { Employee } from '../../../../types/employee';
import { PlannerEmployeeDisplay } from './planner-day-employee-display';
import { calendarStore } from '../../stores/calendar.store';

type PlannerDayProps = {
  updateDay: (day: string, employees: Employee[], previousDay: string) => void;
} & Day;

export const PlannerDay = ({
  day,
  disabled,
  employees,
  id,
  date,
  updateDay,
}: PlannerDayProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const currentMonthDays = calendarStore((state) => state.currentMonthDays);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({
        id,
      }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source, location }) => {
        setIsDraggedOver(false);
        const data = source.data as { employee: Employee };
        updateDay(
          id,
          [data.employee],
          location.initial?.dropTargets?.[0]?.data.id as string
        );
      },
      canDrop: () => !disabled,
    });
  }, [currentMonthDays]);

  return (
    <div
      ref={ref}
      key={id}
      className={cn(
        ' w-full h-full relative rounded-md hover:shadow-lg p-2 transition-all duration-300',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110',
        date.getDay() === 0 || date.getDay() === 6
          ? 'bg-zinc-700/80'
          : 'bg-neutral-700',
        date.toDateString() === new Date().toDateString() ? 'bg-stone-600' : '',
        isDraggedOver
          ? disabled
            ? 'bg-red-200 cursor-not-allowed'
            : 'bg-neutral-500 scale-110 z-10'
          : ''
      )}
    >
      <div className="flex gap-1 w-full h-full content-start flex-wrap overflow-y-auto">
        {employees.map((employee) => (
          <PlannerEmployeeDisplay key={employee.id} employee={employee} />
        ))}
      </div>
      <span className="absolute top-0 right-1">{day}</span>
    </div>
  );
};
