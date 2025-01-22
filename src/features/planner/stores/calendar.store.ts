import { Day } from '@/types/day';
import { create } from 'zustand';

type CalendarStore = {
  currentMonth: number;
  currentYear: number;
  scheduleId: string;
  currentMonthDays: Day[];
  days: Day[];
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  setCurrentMonthDays: (days: Day[]) => void;
  setDays: (days: Day[]) => void;
  setScheduleId: (scheduleId: string) => void;
};

export const calendarStore = create<CalendarStore>()((set) => ({
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  scheduleId: '',
  currentMonthDays: [],
  days: [],
  setCurrentMonth: (month: number) => set({ currentMonth: month }),
  setCurrentYear: (year: number) => set({ currentYear: year }),
  setCurrentMonthDays: (days: Day[]) => set({ currentMonthDays: days }),
  setDays: (days: Day[]) => set({ days }),
  setScheduleId: (scheduleId: string) => set({ scheduleId }),
}));
