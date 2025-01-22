import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { useStoreEmployeeMutation } from '../api/mutation/use-store-employee-mutation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { makeRandomUUID } from '@/utils/utils';
import { Employee } from '@/types/employee';
import { useUpdateEmployeeMutation } from '../api/mutation/use-update-employee-mutation';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
});

type EmployeesFormProps = {
  children: React.ReactNode;
  employee?: Employee;
};

const defaultValues = {
  name: '',
  phone: '',
};

export const EmployeesForm = ({ children, employee }: EmployeesFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: employee ? employee : defaultValues,
  });
  const { toast } = useToast();

  const storeEmployeeMutation = useStoreEmployeeMutation();
  const updateEmployeeMutation = useUpdateEmployeeMutation();

  const [isOpen, setIsOpen] = useState(false);

  const createEmployee = async (data: z.infer<typeof formSchema>) => {
    await storeEmployeeMutation.mutateAsync(
      {
        id: makeRandomUUID(),
        name: data.name,
        phone: data.phone,
      },
      {
        onSuccess: () => {
          form.reset(defaultValues);
          setIsOpen(false);
          toast({
            title: 'Employee created',
            description: `✅ ${data.name} has been created`,
          });
        },
      }
    );
  };

  const updateEmployee = async (data: z.infer<typeof formSchema>) => {
    if (!employee) return;
    await updateEmployeeMutation.mutateAsync(
      {
        ...employee,
        name: data.name,
        phone: data.phone,
      },
      {
        onSuccess: () => {
          form.reset(defaultValues);
          setIsOpen(false);
          toast({
            title: 'Employee updated',
            description: `✅ ${data.name} has been updated`,
          });
        },
      }
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (employee) {
      await updateEmployee(data);
    } else {
      await createEmployee(data);
    }
  };

  useEffect(() => {
    if (employee) form.reset(employee);
  }, [employee]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900 ring-0 border-0">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Update Employee' : 'Create Employee'}
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-2 mt-4">
              <Button type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                {employee ? 'Update Employee' : 'Create Employee'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
