import { ChevronRight, Printer, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { calendarStore } from '../../stores/calendar.store';
import { useStoreMonthDaysMutation } from '../../api/mutation/use-store-month-days.mutation';
import { useToast } from '@/hooks/use-toast';
import { PlannerScheduleMenu } from '../planner-schedule/planner-schedule-menu';
import { PlannerSchedulePrintTemplate } from '../planner-schedule/planner-schedule-print-template';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export type PlannerCalendarHeaderProps = {
  currentMonth: number;
  currentYear: number;
  currentMonthName: string;
  handleChangeMonth: (month: number) => void;
};

export const PlannerCalendarHeader = ({
  currentMonth,
  currentYear,
  currentMonthName,
  handleChangeMonth,
}: PlannerCalendarHeaderProps) => {
  const { toast } = useToast();
  const componentRef = useRef<HTMLDivElement>(null);

  const currentMonthDays = calendarStore((state) => state.currentMonthDays);
  const scheduleId = calendarStore((state) => state.scheduleId);

  const storeMonthDaysMutation = useStoreMonthDaysMutation();

  const handleSave = () => {
    const daysOfMonth = currentMonthDays.filter(
      (day) =>
        day.monthId === `${currentMonth}-${currentYear}-${scheduleId}` &&
        day.yearId === `${currentYear}-${scheduleId}`
    );
    const daysWithEmployeesId = daysOfMonth.map((day) => ({
      ...day,
      employees: day.employees.map((employee) => employee.id),
    }));

    storeMonthDaysMutation.mutate(daysWithEmployeesId, {
      onSuccess: () => {
        toast({
          title: 'Saved',
          description: '✅ Your changes have been saved',
        });
      },
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: landscape;
        margin: 20mm;
      }
    `,
  });

  return (
    <div className="grid grid-cols-3">
      <PlannerScheduleMenu />
      <div className="w-full flex items-center justify-center gap-8 font-bold uppercase text-2xl pt-4">
        <Button
          variant="ghost"
          onClick={() => handleChangeMonth(currentMonth - 1)}
        >
          <ChevronLeft></ChevronLeft>
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-sm">{currentYear}</span>
          <span className="text-2xl">{currentMonthName}</span>
        </div>
        <Button
          variant="ghost"
          onClick={() => handleChangeMonth(currentMonth + 1)}
        >
          <ChevronRight></ChevronRight>
        </Button>
      </div>
      <div className="h-full flex items-center justify-end px-8 gap-2">
        <Button onClick={() => handlePrint()}>
          <Printer />
          <span>Print</span>
        </Button>
        <Button onClick={handleSave} variant={'success'}>
          <Save></Save>
          <span>Save</span>
        </Button>
      </div>

      <PlannerSchedulePrintTemplate
        ref={componentRef}
        days={currentMonthDays}
      />
    </div>
  );
};
