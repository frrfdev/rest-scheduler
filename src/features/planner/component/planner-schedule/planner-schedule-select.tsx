import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { calendarStore } from '../../stores/calendar.store';
import { useGetSchedulesQuery } from '../../api/query/use-get-schedules.query';

export const PlannerScheduleSelect = () => {
  const scheduleId = calendarStore((state) => state.scheduleId);
  const setScheduleId = calendarStore((state) => state.setScheduleId);

  const { data: schedules } = useGetSchedulesQuery();

  const handleSelectSchedule = (id: string) => {
    setScheduleId(id);
  };

  console.log(schedules?.find((schedule) => schedule.id === scheduleId)?.name);

  return (
    <Select onValueChange={handleSelectSchedule}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            schedules?.find((schedule) => schedule.id === scheduleId)?.name
          }
        >
          {schedules?.find((schedule) => schedule.id === scheduleId)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {schedules?.map((schedule) => (
            <SelectItem key={schedule.id} value={schedule.id}>
              {schedule.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
