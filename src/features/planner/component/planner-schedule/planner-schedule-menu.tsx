import { Edit, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PlannerScheduleSelect } from './planner-schedule-select';
import { Plus } from 'lucide-react';
import { PlannerScheduleForm } from './planner-schedule.form';
import { useDestroyScheduleMutation } from '../../api/mutation/use-destroy-schedule';
import { calendarStore } from '../../stores/calendar.store';
import { useToast } from '@/hooks/use-toast';
import { useGetSchedulesQuery } from '../../api/query/use-get-schedules.query';

export const PlannerScheduleMenu = () => {
  const { toast } = useToast();

  const scheduleId = calendarStore((state) => state.scheduleId);
  const setScheduleId = calendarStore((state) => state.setScheduleId);

  const destroyScheduleMutation = useDestroyScheduleMutation();
  const getScheduleQuery = useGetSchedulesQuery();

  const currentSchedule = getScheduleQuery.data?.find(
    (schedule) => schedule.id === scheduleId
  );

  const handleDestroySchedule = async () => {
    await destroyScheduleMutation.mutateAsync(scheduleId, {
      onSuccess: () => {
        toast({
          title: 'Schedule deleted',
          description: '✅ Schedule deleted successfully',
        });
        setScheduleId(
          getScheduleQuery.data?.filter((s) => s.id !== scheduleId)[0].id
        );
      },
    });
  };

  return (
    <div className="flex px-8 justify-end flex-col">
      <strong>Schedule:</strong>
      <div className="flex gap-2 items-center">
        <PlannerScheduleSelect />
        <PlannerScheduleForm>
          <Button variant="ghost">
            <Plus></Plus>
          </Button>
        </PlannerScheduleForm>
        <Button
          onClick={handleDestroySchedule}
          variant="destructive"
          disabled={
            getScheduleQuery.isLoading ||
            getScheduleQuery.isFetching ||
            (getScheduleQuery?.data?.length ?? 0) < 2
          }
        >
          <Trash></Trash>
        </Button>
        <PlannerScheduleForm schedule={currentSchedule}>
          <Button variant="ghost">
            <Edit></Edit>
          </Button>
        </PlannerScheduleForm>
      </div>
    </div>
  );
};
