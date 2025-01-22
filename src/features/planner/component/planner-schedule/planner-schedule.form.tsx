import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schedule } from '@/types/schedule';
import { useStoreScheduleMutation } from '../../api/mutation/use-store-schedule.mutation';
import { useUpdateScheduleMutation } from '../../api/mutation/use-update-schedule.mutation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { calendarStore } from '../../stores/calendar.store';
type PlannerScheduleFormProps = {
  children: React.ReactNode;
  schedule?: Schedule;
};

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

const defaultValues = {
  name: '',
};

export const PlannerScheduleForm = ({
  children,
  schedule,
}: PlannerScheduleFormProps) => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: schedule ?? defaultValues,
  });

  const setScheduleId = calendarStore((state) => state.setScheduleId);

  const storeScheduleMutation = useStoreScheduleMutation();
  const updateScheduleMutation = useUpdateScheduleMutation();

  const createSchedule = async (data: z.infer<typeof formSchema>) => {
    const newSchedule = await storeScheduleMutation.mutateAsync(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset(defaultValues);
        toast({
          title: 'Schedule created',
          description: `✅ Schedule "${data.name}" created successfully`,
        });
      },
    });

    setScheduleId(newSchedule.id);
  };

  const updateSchedule = async (data: z.infer<typeof formSchema>) => {
    if (!schedule) return;
    await updateScheduleMutation.mutateAsync(
      {
        ...data,
        id: schedule.id,
        years: schedule.years,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset(defaultValues);
          toast({
            title: 'Schedule updated',
            description: `✅ Schedule "${data.name}" updated successfully`,
          });
        },
      }
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (schedule) {
      await updateSchedule(data);
    } else {
      await createSchedule(data);
    }
  };

  useEffect(() => {
    if (schedule) {
      form.setValue('name', schedule.name);
    }
  }, [schedule]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900 ring-0 border-0">
        <DialogHeader>
          <DialogTitle>
            {schedule ? 'Update schedule' : 'New schedule'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-2 mt-4">
              <Button type="button">Cancel</Button>
              <Button type="submit" variant="success">
                {schedule ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
