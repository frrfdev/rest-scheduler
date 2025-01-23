import { Day } from '@/types/day';
import { forwardRef } from 'react';
import { useGetSchedulesQuery } from '../../api/query/use-get-schedules.query';
import { calendarStore } from '../../stores/calendar.store';

type WeekRow = (Day | null)[];

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const groupDaysByWeek = (days: Day[]): WeekRow[] => {
  if (!days || !days.length) return [];

  const sortedDays = [...days].sort(
    (a, b) => a?.date.getTime() - b?.date.getTime()
  );
  const weeks: WeekRow[] = [];
  let currentWeek: WeekRow = [];

  // Fill in empty days at start if month doesn't begin on Sunday
  const firstDay = sortedDays[0]?.date;
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  sortedDays.forEach((day) => {
    const dayOfWeek = day?.date.getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Fill in empty days at end if needed
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

interface PrintTemplateProps {
  days: Day[];
  monthName: string;
  year: number;
}

export const PlannerSchedulePrintTemplate = forwardRef<
  HTMLDivElement,
  PrintTemplateProps
>(({ days, monthName, year }, ref) => {
  const weeks = groupDaysByWeek(days);

  const scheduleId = calendarStore((state) => state.scheduleId);

  const getSchedulesQuery = useGetSchedulesQuery();

  const scheduleName = getSchedulesQuery.data?.find(
    (schedule) => schedule.id === scheduleId
  )?.name;

  return (
    <div
      ref={ref}
      className="w-full h-full p-8 print:p-2 print:landscape bg-white text-black hidden print:block"
    >
      <h1 className="text-2xl font-bold mb-4 text-center print:text-black">
        {monthName} {year} - {scheduleName}
      </h1>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} className="border p-2 text-center print:text-black">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className="border p-2 min-h-[100px] align-top print:text-black"
                >
                  {day && (
                    <>
                      <div className="font-bold mb-2">{day.day}</div>
                      <div className="text-sm">
                        {day.employees.map((employee) => (
                          <div key={employee.id}>{employee.name}</div>
                        ))}
                      </div>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

PlannerSchedulePrintTemplate.displayName = 'PlannerSchedulePrintTemplate';
