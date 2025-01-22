import { useEffect, useState } from 'react';
import { PlannerDay } from './planner-day';
import { Employee } from '../../../../types/employee';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { PlannerDeleteButton } from '../planner-delete.button';
import { useToast } from '@/hooks/use-toast';
import { PlannerCalendarHeader } from './planner-calendar-header';
import { calendarStore } from '../../stores/calendar.store';
import { useGetMonthDaysQuery } from '../../api/query/use-get-month-days.query';
import { useGetSchedulesQuery } from '../../api/query/use-get-schedules.query';
import { Loader } from '@/components/ui/loader';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDate();
};

const getDayInWeek = (month: number, year: number, day: number) => {
  return new Date(year, month, day).getDay();
};

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getDaysOfMonth = (month: number, year: number) => {
  return Array.from({ length: getDaysInMonth(month, year) }).map(
    (_, index) => index + 1
  );
};

const makeDay = (
  day: number,
  disabled: boolean,
  month: number,
  year: number,
  scheduleId: string
) => ({
  id: `${month}-${day}-${year}-${scheduleId}`,
  day,
  disabled: disabled,
  employees: [],
  monthId: `${month}-${year}-${scheduleId}`,
  yearId: `${year}-${scheduleId}`,
  scheduleId: scheduleId,
  date: new Date(year, month, day),
});

const fillDaysOfMonth = (month: number, year: number, scheduleId: string) => {
  const daysOfMonth = getDaysOfMonth(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);
  const firstDayOfMonthNumber = getDayInWeek(month, year, firstDayOfMonth);
  const lastDayOfPreviousMonth = getDaysInMonth(month - 1, year);
  const isFirstMonth = month === 0;
  const isLastMonth = month === 11;

  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;

  return [
    ...Array.from({ length: firstDayOfMonthNumber })
      .map((_, index) => lastDayOfPreviousMonth - index)
      .reverse()
      .map((day) =>
        makeDay(
          day,
          true,
          prevMonth,
          isFirstMonth ? year - 1 : year,
          scheduleId
        )
      ),
    ...daysOfMonth.map((day) => makeDay(day, false, month, year, scheduleId)),
    ...Array.from({ length: 42 - daysOfMonth.length - firstDayOfMonthNumber })
      .map((_, index) => index + 1)
      .map((day) =>
        makeDay(day, true, nextMonth, isLastMonth ? year + 1 : year, scheduleId)
      ),
  ];
};

export const PlannerCalendar = () => {
  const { toast } = useToast();

  const currentMonth = calendarStore((state) => state.currentMonth);
  const currentYear = calendarStore((state) => state.currentYear);
  const setCurrentMonth = calendarStore((state) => state.setCurrentMonth);
  const setCurrentYear = calendarStore((state) => state.setCurrentYear);
  const scheduleId = calendarStore((state) => state.scheduleId);
  const setCurrentMonthDays = calendarStore(
    (state) => state.setCurrentMonthDays
  );
  const currentMonthDays = calendarStore((state) => state.currentMonthDays);
  const setScheduleId = calendarStore((state) => state.setScheduleId);

  const [showDelete, setShowDelete] = useState(false);

  const getMonthDaysQuery = useGetMonthDaysQuery({
    monthId: `${currentMonth}-${currentYear}-${scheduleId}`,
    yearId: `${currentYear}-${scheduleId}`,
    scheduleId: scheduleId,
  });

  const getScheduleQuery = useGetSchedulesQuery();

  const currentMonthName = new Date(currentYear, currentMonth).toLocaleString(
    'default',
    {
      month: 'long',
    }
  );

  const handleChangeMonth = (month: number) => {
    if (month < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
      setCurrentMonthDays(fillDaysOfMonth(month, currentYear - 1, scheduleId));
    } else if (month > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
      setCurrentMonthDays(fillDaysOfMonth(month, currentYear + 1, scheduleId));
    } else {
      setCurrentMonth(month);
      setCurrentMonthDays(fillDaysOfMonth(month, currentYear, scheduleId));
    }
  };

  const handleUpdateDay = (
    day: string,
    employees: Employee[],
    previousDay: string
  ) => {
    const updatedDays = currentMonthDays.map((d) => {
      return {
        ...d,
        employees:
          d.id === day
            ? Array.from(new Set([...d.employees, ...employees]))
            : d.id === previousDay
            ? d.employees.filter((e) => e.id !== employees[0].id)
            : d.employees,
      };
    });
    setCurrentMonthDays(updatedDays);

    toast({
      title: 'Employee added',
      description: `✅ ${employees
        .map((e) => e.name)
        .join(', ')} will have this day off`,
    });
  };

  const handleRemoveEmployeeFromDay = (employee: Employee, dayId: string) => {
    setCurrentMonthDays(
      currentMonthDays.map((d) =>
        d.id === dayId
          ? {
              ...d,
              employees: d.employees.filter((e) => e.id !== employee.id),
            }
          : d
      )
    );
    toast({
      title: 'Employee removed',
      description: `❌ ${employee.name} will no longer have this day off`,
    });
  };

  useEffect(() => {
    if (getMonthDaysQuery.data) {
      if (getMonthDaysQuery.data.length === 0) {
        setCurrentMonthDays(
          fillDaysOfMonth(currentMonth, currentYear, scheduleId)
        );
      } else {
        setCurrentMonthDays(
          fillDaysOfMonth(currentMonth, currentYear, scheduleId).map(
            (day) => getMonthDaysQuery.data.find((d) => d.id === day.id) || day
          )
        );
      }
    }
  }, [getMonthDaysQuery.data]);

  useEffect(() => {
    if (!scheduleId) {
      const id = getScheduleQuery.data?.[0].id;
      setScheduleId(id);
      setCurrentMonthDays(fillDaysOfMonth(currentMonth, currentYear, id));
    }
  }, [getScheduleQuery.data]);

  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ location }) => {
        if (location.initial?.dropTargets?.[0]?.data.id) {
          setShowDelete(true);
        }
      },
      onDrop: () => setShowDelete(false),
    });
  }, []);

  return (
    <Loader
      isVisible={getMonthDaysQuery.isLoading || getScheduleQuery.isLoading}
    >
      <div className="bg-neutral-800 relative w-full h-full flex flex-col [background-image:radial-gradient(#4040409F_1px,transparent_1px)] [background-size:40px_40px]">
        <PlannerCalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          currentMonthName={currentMonthName}
          handleChangeMonth={handleChangeMonth}
        />
        <div className="grid grid-cols-7 px-8 py-4">
          {daysOfWeek.map((day) => (
            <span key={day} className="w-full text-center">
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 auto-rows-fr w-full h-full p-8 pt-0">
          {currentMonthDays.map((day) => (
            <PlannerDay {...day} updateDay={handleUpdateDay} />
          ))}
        </div>
        <PlannerDeleteButton
          isVisible={showDelete}
          onDrop={handleRemoveEmployeeFromDay}
        ></PlannerDeleteButton>
      </div>
    </Loader>
  );
};
