import { Employee } from './employee';

export type Day = {
  day: number;
  disabled: boolean;
  employees: Employee[];
  id: string;
  scheduleId: string;
  monthId: string;
  yearId: string;
  date: Date;
};
